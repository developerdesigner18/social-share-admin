import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../environments/environment';
// import { environment } from '../environments/environment.prod';
import { NbToastrService } from '@nebular/theme';

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
    private injector: Injector, private toastrService: NbToastrService) { }

    redirectUrl: string;

    login(email: string, password: string) {
      return this.httpClient
        .post<any>(`${environment.apiUrl}/auth/signin`, {
          email: email,
          password: password,
        })
        .pipe(
          map((user) => {
            if (user && user.token && user.data.type === 'admin') {
              localStorage.setItem('adminUser', JSON.stringify(user));
              localStorage.setItem('admintoken', user.token);
              this.router.navigate(['/pages/dashboard'])
            } else {
              this.toastrService.danger('You have not authorized to login admin panel.')
            }
            return user || {};
          }),
          catchError(this.handleError.bind(this))
        );
    }
    newPost(u_token, msg, imgUrl, valid, type): Observable<any> {
      const formData: any = new FormData();
      formData.append('description', msg);
      formData.append('valid', valid);
      formData.append('type', type);
      for (let i = 0; i < imgUrl.length; i++) {
        formData.append('Url', imgUrl[i]);
      }
  
      return this.httpClient.post(`${environment.apiUrl}/api/photos/newCommunityPosts`, formData, { headers: { token: u_token } }).pipe(
        catchError(this.handleError)
      )
    }

    newtextPost(u_token, msg, valid, type): Observable<any> {
      const formData: any = new FormData();
      formData.append('description', msg);
      formData.append('valid', valid);
      formData.append('type', type);
      return this.httpClient.post(`${environment.apiUrl}/api/photos/newCommunityPosts`, formData, { headers: { token: u_token } }).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
    }

    checktoken(){
      if (localStorage.getItem('admintoken')) {
        this.router.navigate(['/pages/dashboard'])
        return true;
      }
      return false;
    }

    isLoggedIn() {
      if (localStorage.getItem('adminUser')) {
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

    getCommunityPosts(): Observable<any>{
      return this.httpClient
      .get(`${environment.apiUrl}/api/admin/getAllCommunityPosts`, {
        headers: this.headers,
      })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
    }

    deleteCommunityPosts(postId): Observable<any>{
      return this.httpClient
      .post(`${environment.apiUrl}/api/admin/deletecommunityPost`, { headers: this.headers, postId: postId })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
    }

    changeTheme(id, data): Observable<any> {
      return this.httpClient.post(`${environment.apiUrl}/api/user/theme`, { id: id, data: data }).pipe(
        map((res) => {
          return res
        }),
        catchError(this.handleError)
      )
    }

    getUserMonthData(data): Observable<any>{
      return this.httpClient
      .post(`${environment.apiUrl}/api/user/getUserMonthData`, {date: data})
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
    }
    getPostMonthData(data): Observable<any>{
      return this.httpClient
      .post(`${environment.apiUrl}/api/photos/getPostMonthData`, {date: data})
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
    }

    logOut(): any{
      localStorage.removeItem('adminUser');
      localStorage.removeItem('admintoken');
      // window.location.replace('');
      this.router.navigate(['login'])
    }
    
    private handleError(error: HttpErrorResponse) {
      let msg = '';
      if(error.status === 500){
        this.toastrService.danger('Authentication is failed. Please check your email and paswword.')
      } else if(error.status === 422){
        this.toastrService.danger('Email id is already exist.')
      } else {
        this.toastrService.danger('Error occured!')
      }
      return throwError(msg);
    }
}
