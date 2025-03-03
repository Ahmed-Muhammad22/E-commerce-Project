import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/myTranslate/my-translate.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  countCart = computed(() => this.cartService.cartNumber());
  countWishlist = computed(() => this.wishlistService.wishlistNumber());
  isLogin = input<boolean>(true);
  readonly _AuthService = inject(AuthService);
  private readonly myTranslateService = inject(MyTranslateService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  readonly translateService = inject(TranslateService);
  ngOnInit(): void {
    this.cartService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistService.wishlistNumber.set(res.data.length);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  change(lang: string): void {
    this.myTranslateService.changeTranslateLang(lang);
  }
}
