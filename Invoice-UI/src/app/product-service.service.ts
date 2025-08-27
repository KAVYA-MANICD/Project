import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductService {
  id?: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private apiUrl = 'http://localhost:8080/product-services';

  constructor(private http: HttpClient) { }

  getProductServices(): Observable<ProductService[]> {
    return this.http.get<ProductService[]>(this.apiUrl);
  }

  addProductService(productService: ProductService): Observable<ProductService> {
    return this.http.post<ProductService>(this.apiUrl, productService);
  }

  updateProductService(id: number, productService: ProductService): Observable<ProductService> {
    return this.http.put<ProductService>(`${this.apiUrl}/${id}`, productService);
  }

  deleteProductService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
