import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, SweetAlert2Module, RouterLink, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  cartDetails: ICart = {} as ICart;

  ngOnInit(): void {
    this.getCartData();
  }
  getCartData(): void {
    this.cartService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeItem(id: string): void {
    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
        this.cartService.cartNumber.set(res.numOfCartItems);
        Swal.fire(
          'Success',
          'The operation was successfully deleted.',
          'success'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateItem(id: string, count: number): void {
    this.cartService.updateCartProduct(id, count).subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  clearCart(): void {
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        console.log(res.data);
        if (res.message === 'success') {
          this.cartDetails = {} as ICart;
          this.cartService.cartNumber.set(0);
          Swal.fire(
            'Success',
            'The operation was successfully deleted.',
            'success'
          );
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
