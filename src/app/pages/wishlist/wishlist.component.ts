import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from './../../shared/interfaces/iwishlist';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe, RouterLink, TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  wishlist: IWishlist[] = [];

  ngOnInit(): void {
    this.getWishlistData();
  }

  getWishlistData(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.data);
        this.wishlist = res.data;
        this.wishlistService.wishlistNumber.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addCardItem(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message, 'FreshCart');
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeProductFromWish(id: string | null): void {
    this.wishlistService.removeSpecificWishlistItem(id).subscribe({
      next: (res) => {
        console.log('API Response:', res);

        if (res.status === 'success') {
          this.getWishlistData();
          this.wishlistService.wishlistNumber.set(res.data.length);
          this.toastrService.success(res.message, 'FreshCart');
        } else {
          this.toastrService.error(
            'Failed to remove item from wishlist.',
            'FreshCart'
          );
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.toastrService.error(
          err.error.message || 'Something went wrong!',
          'FreshCart'
        );
      },
    });
  }
}
