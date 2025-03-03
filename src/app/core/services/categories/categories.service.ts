import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private httpClient: HttpClient) {}
  getAllCategories(): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}api/v1/categories`
    );
  }
  getSpecificCategory(id: string | null): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}api/v1/categories/${id}`
    );
  }
  getAllSubCategoriesOnCategory(id: string | null): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}api/v1/categories/${id}/subcategories`
    );
  }
}
