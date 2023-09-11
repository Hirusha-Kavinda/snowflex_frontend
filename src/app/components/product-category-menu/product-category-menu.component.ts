import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent {

  productCategories : ProductCategory[] = [];


  constructor(private productService : ProductService, 
              private router : Router){}


  ngOnInit(){
    this.listProductCategories();
  }

  listProductCategories(){
   this.productService.getProductCategories().subscribe(
    data => {
      console.log('Product Categories=' + JSON.stringify(data));
      this.productCategories = data;
    }
   );
  }


  category(Id: number){
    this.router.navigateByUrl("category/"+Id)
  }

}
