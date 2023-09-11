import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  
  private categoryUrl = 'http://localhost:8080/api/product-category';


  constructor(private httpClient: HttpClient) { }


getProductList(theCaregoryId:number): Observable <Product[]>{
const searchUrl =`${this.baseUrl}/search/findByCategoryId?id=${theCaregoryId}`;
   /* 
   return  this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
   map(response => response._embedded.products));    
   */
   // refactor up wards
    return  this.getProducts(searchUrl);
  }



  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable <GetResponseProduct>{
    const searchUrl =`${this.baseUrl}/search/findByCategoryId?id=${theCaregoryId}`;
    return  this.getProducts(searchUrl);
      }




  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

getProductCategories():Observable <ProductCategory[]>{
  return  this.httpClient.get<GetResponseCategory>(this.categoryUrl).pipe(
    map(response => response._embedded.productCategory)
  );

}



searchProduct(theKeyword: string):Observable<Product[]>{
  // need to build URL based on the keyword
  const searchUrl =`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
  return  this.getProduts(searchUrl);
}



  private getProduts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }


  getProduct(theProductId : number): Observable<Product>{
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  } 
}

interface GetResponseProduct{
  _embedded:{
    products: Product[];
  }

  page:{
    size: number,
    totalElements: number;
    totalPages: number;
    number: number
  }
}

interface GetResponseCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}
