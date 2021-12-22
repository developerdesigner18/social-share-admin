import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NbDatepickerModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {NgxImageCompressService} from 'ngx-image-compress'; 
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsHistoryModule } from './posts-history/posts-history.module';
import {RouterModule} from '@angular/router';
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    UsersModule,
    PostsModule,
    MatDialogModule,
    PickerModule,
    FormsModule,
    ReactiveFormsModule,
    NbDatepickerModule.forRoot(),
    PostsHistoryModule,
    RouterModule
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    NgxImageCompressService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
}
