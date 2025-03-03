import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';

@Component({
  selector: 'app-categoriesdetails',
  imports: [],
  templateUrl: './categoriesdetails.component.html',
  styleUrl: './categoriesdetails.component.scss',
})
export class CategoriesdetailsComponent implements OnInit {
  detailsCategory: ICategory | null = null;
  idCategory: string | null = '';
  subCategoryData: any[] = [];
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CategoriesService = inject(CategoriesService);
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        console.log(p.get('id'));
        this.idCategory = p.get('id');
      },
    });
    this._CategoriesService.getSpecificCategory(this.idCategory).subscribe({
      next: (res) => {
        this.detailsCategory = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._CategoriesService
      .getAllSubCategoriesOnCategory(this.idCategory)
      .subscribe({
        next: (res) => {
          this.subCategoryData = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
