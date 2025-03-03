import Swal from 'sweetalert2';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/order/order.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  cartDetails: ICart = {} as ICart;
  cartId: string = '';
  isLoading: boolean = false;
  checkOutForm: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
    city: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z\s'-]{3,50}$/),
    ]),
  });
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        console.log(p.get('id'));
        this.cartId = p.get('id')!;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  submitForm(event: MouseEvent): void {
    event.preventDefault();
    console.log(this.checkOutForm.value);
    this.orderService
      .checkOutSession(this.cartId, this.checkOutForm.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          console.log(res.session.url);
          if (res.status === 'success') {
            window.open(res.session.url, '_self');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getCashPay(): void {
    console.log(this.checkOutForm.value);

    this.orderService
      .checkOutSession(this.cartId, this.checkOutForm.value)
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            Swal.fire(
              'Success',
              'The payment has been successfully processed.',
              'success'
            );
            this.cartService.clearUserCart().subscribe({
              next: (res) => {
                if (res.message === 'success') {
                  this.cartDetails = {} as ICart;
                  this.cartService.cartNumber.set(0);
                }
              },
              error: (err) => {
                console.error('Error clearing cart:', err);
                Swal.fire(
                  'Error',
                  'Failed to clear the cart. Please try again.',
                  'error'
                );
              },
            });

            setTimeout(() => {
              this.router.navigate(['/allorders']);
            }, 1200);
          }
        },
        error: (err) => {
          console.error('Payment Error:', err);
          Swal.fire('Error', 'Payment failed. Please try again.', 'error');
        },
      });
  }
}
