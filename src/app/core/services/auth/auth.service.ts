import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: BehaviorSubject<any> = new BehaviorSubject(null);
  private readonly _Router = inject(Router);
  constructor(private httpClient: HttpClient) {}

  getRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `https://ecommerce.routemisr.com/api/v1/auth/signup`,
      data
    );
  }
  getLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `https://ecommerce.routemisr.com/api/v1/auth/signin`,
      data
    );
  }

  saveUserData(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        this.userData.next(decodedUser); 
        console.log('Decoded User:', decodedUser);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No user token found in localStorage');
    }
  }
  logOut(): void {
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this._Router.navigate(['/login']);
  }

  setVerifyEmail(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}api/v1/auth/forgotPasswords`,
      data
    );
  }
  setVerifyCode(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}api/v1/auth/verifyResetCode`,
      data
    );
  }
  setResetPassword(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}api/v1/auth/resetPassword`,
      data
    );
  }
}
