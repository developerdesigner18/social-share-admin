import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth.service';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authService: AuthService) {

          this.menuService.onItemClick()
          .subscribe((event) => {
            this.changeNavigation(event.item.title)
          });
  }

  ngOnInit() {
    var theme = localStorage.getItem('adminTheme')
    if(theme){
      this.themeService.changeTheme(theme);
    } else {
      this.currentTheme = this.themeService.currentTheme;
    }
    var main_users = {
      name: 'Michel lambart',
      picture: 'assets/images/nick.png'
    }
    this.user = main_users;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    var data = localStorage.getItem('adminUser')
    console.log("data", JSON.parse(data).data._id)
    this.themeService.changeTheme(themeName);
    this.authService.changeTheme(JSON.parse(data).data._id, themeName).subscribe((res) => {
      if(res.success === true){
        localStorage.setItem('adminTheme', themeName)
      }
    })
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  changeNavigation(value){
    if(value == 'Log out'){
      this.authService.logOut()
    }
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
