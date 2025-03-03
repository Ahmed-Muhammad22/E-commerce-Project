import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartNumber: WritableSignal<number> = signal(0);
  myToken: any = localStorage.getItem('userToken');
  constructor(private httpClient: HttpClient) {}
  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}api/v1/cart`,
      {
        productId: id,
      },
      {
        headers: {
          token: this.myToken,
        },
      }
    );
  }

  getLoggedUserData(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}api/v1/cart`, {
      headers: {
        token: this.myToken,
      },
    });
  }

  removeSpecificCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}api/v1/cart/${id}`, {
      headers: {
        token: this.myToken,
      },
    });
  }
  updateCartProduct(id: string, newCount: number): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}api/v1/cart/${id}`,
      {
        count: newCount,
      },
      {
        headers: {
          token: this.myToken,
        },
      }
    );
  }

  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}api/v1/cart`, {
      headers: {
        token: this.myToken,
      },
    });
  }

  
}
