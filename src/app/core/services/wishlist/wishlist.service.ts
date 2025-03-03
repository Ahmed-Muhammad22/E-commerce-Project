import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistNumber: WritableSignal<number> = signal(0);
  myToken: string | null = localStorage.getItem('userToken');

  constructor(private httpClient: HttpClient) {}

  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}api/v1/wishlist`,
      { productId: id },
      {
        headers: { token: this.myToken || '' },
      }
    );
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}api/v1/wishlist`, {
      headers: { token: this.myToken || '' },
    });
  }

  removeSpecificWishlistItem(id: string | null): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}api/v1/wishlist/${id}`,
      {
        headers: { token: this.myToken || '' },
      }
    );
  }

  loadWishlistCount(): void {
    this.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistNumber.set(res.data.length);
      },
    });
  }
}
