import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ProductsService } from '../../core/services/products/products.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { IProduct } from '../../shared/interfaces/iproduct';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { TextPipe } from '../../shared/pipes/text.pipe';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CarouselModule,
    FormsModule,
    RouterLink,
    CurrencyPipe,
    TextPipe,
    SearchPipe,
    TranslatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  term: string = '';
  star: number = 0;
  products: WritableSignal<IProduct[]> = signal([]);
  categories: WritableSignal<ICategory[]> = signal([]);
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 3000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };
  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 3000,
    navText: ['', ''],
    items: 1,
    nav: false,
  };
  ngOnInit(): void {
    this.getProductsData();
    this.getCategoriesData();
  }

  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.products.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCategoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categories.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addCardItem(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.toastrService.success(res.message, 'FreshCart');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  addProductToWish(id: string): void {
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistService.wishlistNumber.set(res.data.length);
        this.toastrService.success(res.message, 'FreshCart');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
