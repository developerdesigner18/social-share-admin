import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  settings = {
    add: false,
    edit: false,
    delete: false,
    actions: false,
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      userName: {
        title: 'Username',
        type: 'string',
      },
      emailId: {
        title: 'Email',
        type: 'string',
      },
      city: {
        title: 'City',
        type: 'string',
      },
      country: {
        title: 'Country',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, private authservice: AuthService, private toastrService: NbToastrService) { 
    const data = this.service.getData();
    this.authservice.getAllUsers().subscribe((res) => {
      if(res.success === true){
        this.source.load(res.data);
      } else {
        this.errorhandling(res.message)
      }
    })
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  ngOnInit(): void {

  }
  errorhandling(msg){
    this.toastrService.danger(msg)
  }

}
