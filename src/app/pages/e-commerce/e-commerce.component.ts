import { Component, OnInit } from '@angular/core';

import { AuthService} from '../../auth.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.css']
})
export class ECommerceComponent implements OnInit{

  userslength: boolean
  postslength: boolean

  constructor(private authservice: AuthService, private toastrService: NbToastrService, public routing: Router){
    this.authservice.getAllUsers().subscribe((res) => {
      if(res.success === true){
        this.userslength = res.length
      } else {
        this.errorhandling(res.message)
      }
    })
    this.authservice.getAllPosts().subscribe((res) => {
      if(res.success === true){
        this.postslength = res.length
      } else {
        this.errorhandling(res.message)
      }
    })
  }

  ngOnInit(): void {
  }

  router(value){
    this.routing.navigate(['/pages/' + value])
  }

  errorhandling(msg){
    this.toastrService.danger(msg)
  }
}
