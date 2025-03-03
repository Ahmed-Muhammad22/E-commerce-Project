import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  brands: IBrand[] = [];

  ngOnInit(): void {
    this.getBrandsData();
  }
  getBrandsData(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        console.log(res.data);
        this.brands = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
