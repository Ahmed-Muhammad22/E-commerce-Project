import { Component, inject, OnInit } from '@angular/core';
import { IBrand } from '../../shared/interfaces/ibrand';
import { ActivatedRoute } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands.service';

@Component({
  selector: 'app-brandsdetails',
  imports: [],
  templateUrl: './brandsdetails.component.html',
  styleUrl: './brandsdetails.component.scss',
})
export class BrandsdetailsComponent implements OnInit {
  detailsBrand: IBrand | null = null;
  idBrand: string | null = '';

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _BrandsService = inject(BrandsService);
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        console.log(p.get('id'));
        this.idBrand = p.get('id');
      },
    });
    this._BrandsService.getSpecificBrand(this.idBrand).subscribe({
      next: (res) => {
        this.detailsBrand = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
