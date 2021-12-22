import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'ngx-posts-history',
  templateUrl: './posts-history.component.html',
  styleUrls: ['./posts-history.component.scss']
})
export class PostsHistoryComponent implements OnInit {

  settings = {
    actions: {
      custom: [
        {
          name: 'deleteAction',
          title: '<i class="far fa-trash-alt" title="delete"></i>'
        }
      ],
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      type: {
        title: 'Type',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      valid: {
        title: 'Last Date',
        type: 'string',
      },
      imageLength: {
        title: 'Image',
        type: 'number',
        width: '20px'
      },
      likeLength: {
        title: 'Like',
        type: 'number',
        width: '20px'
      },
      commentLength: {
        title: 'Comment',
        type: 'number',
        width: '20px'
      },
      shareLength: {
        title: 'Share',
        type: 'number',
        width: '20px'
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: SmartTableData, private authservice: AuthService, private toastrService: NbToastrService, private router: Router) {
    this.authservice.getCommunityPosts().subscribe((res) => {
      if(res.success === true){
        this.source.load(res.main_data);
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

  onEditConfirm(event){
  }

  onCustom(event){
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
        this.authservice.deleteCommunityPosts(event.data.id).subscribe((res) =>{
          res.success === true ? this.toastrService.success(res.message) : this.toastrService.danger(res.message)
        })
      } else {
        
      }
    
  }

  ngOnInit(): void {
  }

  errorhandling(msg){
    this.toastrService.danger(msg)
  }

}
