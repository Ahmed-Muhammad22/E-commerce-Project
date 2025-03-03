import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { OrderService } from '../../core/services/order/order.service';
import { IOrder } from '../../shared/interfaces/iorder';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-allorders',
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);

  orders: IOrder[] = [];
  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(): void {
    this.authService.saveUserData();
    this.authService.userData.subscribe({
      next: (res) => {
        console.log('User Data:', res);
        if (res && res.id) {
          this.getOrdersData(res.id);
        } else {
          console.warn('User ID is null or undefined');
        }
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  getOrdersData(id: string): void {
    this.orderService.getUserOrders(id).subscribe({
      next: (res) => {
        console.log('Orders Data:', res);
        this.orders = res;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  // idUser: any = '';
  // ngOnInit(): void {
  //   this.getOrdersData();
  // }
  // getOrdersData(): void {
  //   this.authService.saveUserData();
  //   // localStorage.getItem("userToken");

  //   this.orderService.getUserOrders(this.idUser).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       if (res.message === 'success') {
  //         this.orders = res;
  //       }
  //     },
  //   });
  // }
}
