import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsHistoryComponent } from './posts-history.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbListModule, NbProgressBarModule, NbSelectModule, NbTabsetModule, NbUserModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    PostsHistoryComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    NbProgressBarModule,
    Ng2SmartTableModule,
    RouterModule
  ]
})
export class PostsHistoryModule { }
