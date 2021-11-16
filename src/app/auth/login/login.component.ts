import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  getrememberMe = false;
  remCheck = false;

  constructor(private fb: FormBuilder,
    public authService: AuthService,
    public router: Router,) {
      this.loginForm = this.fb.group({
        email: [
          (localStorage.getItem('email') ? localStorage.getItem('email') : ''), [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
        password: [
          (localStorage.getItem('password') ? localStorage.getItem('password') : ''),
          [Validators.required, Validators.minLength(6)],
        ],
      });
     }

  ngOnInit(): void {
    if (localStorage.getItem('email') !== null && localStorage.getItem('password') !== null) {
      this.remCheck = true;
    }
    this.authService.checktoken()
  }

  get formControls() { return this.loginForm.controls; }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
  if (!this.loginForm.valid) {
    this.submitted = true;
    return false;
  }
  this.authService.login(this.email.value, this.password.value).subscribe((res) => {
    console.log("res", res)
  });
    // if (this.authService.isLoggedIn() !== true) {
    //   this.loginForm.reset();
    //   this.submitted = false;
    // }
  }

  rememberMe(event) {
    if (event.target.checked) {
      localStorage.setItem('email', this.email.value);
      localStorage.setItem('password', this.password.value);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }

}
