import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
  NbInputModule,
  NbDatepickerModule,
  NbDialogModule,
} from '@nebular/theme';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PostsComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    NbProgressBarModule,
    NbInputModule,
    MatDialogModule,
    PickerModule,
    FormsModule, 
    ReactiveFormsModule,
    NbDatepickerModule,
    RouterModule,
    NbDialogModule.forChild()
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostsModule { }
