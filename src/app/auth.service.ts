import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../environments/environment';
// import { environment } from '../environments/environment.prod';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './@core/data/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private httpClient: HttpClient,
    public router: Router,
    private injector: Injector) { }

    redirectUrl: string;

    login(email: string, password: string) {
      return this.httpClient
        .post<any>(`${environment.apiUrl}/auth/signin`, {
          email: email,
          password: password,
        })
        .pipe(
          map((user) => {
            if (user && user.token) {
              localStorage.setItem('currentUser', JSON.stringify(user));
              localStorage.setItem('token', user.token);
              this.router.navigate(['/pages/dashboard'])
            }
            return user || {};
          }),
          catchError(this.handleError.bind(this))
        );
    }
    newPost(u_token, msg, imgUrl): Observable<any> {
      const formData: any = new FormData();
      formData.append('description', msg);
      for (let i = 0; i < imgUrl.length; i++) {
        formData.append('Url', imgUrl[i]);
      }
  
      return this.httpClient.post(`${environment.apiUrl}/api/photos/newPosts`, formData, { headers: { token: u_token } }).pipe(
        catchError(this.handleError)
      )
    }

    newtextPost(u_token, msg): Observable<any> {
      const formData: any = new FormData();
      formData.append('description', msg);
      return this.httpClient.post(`${environment.apiUrl}/api/photos/newPosts`, formData, { headers: { token: u_token } }).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
    }

    checktoken(){
      if (localStorage.getItem('token')) {
        this.router.navigate(['/pages/dashboard'])
        return true;
      }
      return false;
    }

    isLoggedIn() {
      if (localStorage.getItem('currentUser')) {
        return true;
      }
      return false;
    }

    getAllUsers(): Observable<any>{
      return this.httpClient
      .get(`${environment.apiUrl}/api/admin/getAllUsers`, {
        headers: this.headers,
      })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
    }

    getAllPosts(): Observable<any>{
      return this.httpClient
      .get(`${environment.apiUrl}/api/admin/getAllPosts`, {
        headers: this.headers,
      })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
    }

    private handleError(error: HttpErrorResponse) {
      let msg = '';
      if (
        error.error.message ==
        'friend request already sent or recive either you are already friends'
      ) {
        // alert('Request already send')
        // this.toastr.info('Request already send');
      } else if (
        error.error.success == false &&
        error.error.message == 'email in not registered'
      ) {
        // this.dialog.open(DialogEmailErrorComponent, {
        //   width: '500px',
        // });
      }
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
        (msg = 'An error occurred:'), error.error.message;
      } else {
        console.error(
          `Backend returned code ${error.status}, ` +
            `body was: ${error.error.message}`
        );
        msg =
          'Backend returned code ${error.status}, ` + `body was: ${error.error.message}';
        if (error.status == 500) {
          // this.toastr.error(
          //   'Authentication is failed. Please check your email and paswword.'
          // );
        } else if (error.status == 422) {
          // this.toastr.error('Email id is already exist.');
          // this.dialog.open(DialogErrorComponent, {
          //   width: '500px'
          // })
        } else {
          console.error('some error occured', error.error.message);
        }
      }
      return throwError(msg);
    }
}
