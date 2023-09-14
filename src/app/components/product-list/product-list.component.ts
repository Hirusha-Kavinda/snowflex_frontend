import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartItemService } from 'src/app/service/cart-item.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{


  products : Product[] =[];
  currentCategoryId: number ;
  previousCategoryId: number ;
  searchMode: boolean = false;



  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 12;
  theTotalElements: number = 0;


  previousKeyword: string = "";


  constructor(private productService : ProductService ,
              private route: ActivatedRoute,
              private cartService : CartItemService){ 
                
              }

              ngOnInit(): void {
                this.route.queryParams.subscribe((params: Params) => {
                  const keyword = params['keyword'];
                  if (keyword) {
                    this.handleSearchProducts(keyword);
                  } else {
                    this.listProducts();
                  }
                });
              }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword')

    if(this.searchMode){
      this.handleSearchProducts('');
    }
    else{
      this.handleListProducts();
    }

  }



  handleSearchProducts(keyword: string){
    const theKeyword : string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // the set thePageNumber to 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // now search for the products using keyword
    this.productService.searchProductPaginate(this.thePageNumber -1, 
                                              this.thePageSize, 
                                              keyword).subscribe(this.processResult());

  }


  handleListProducts(){

  // check if "id" parameter is available
  const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

  if (hasCategoryId)  {
    // get the "id" param string . convert string to a number using the "+" symbol
    
    this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

  }
  else{
    // not category id available ... default to category id 1 
    this.currentCategoryId = 1;

  }

  // check if we have a different category than previous
  // Note : angular will reuse a component if it is currently being viewed
  // if we have a different cateogry id than previous 
  // then set thePageNumber back to 1 
  if(this.previousCategoryId != this.currentCategoryId) {
    this.thePageNumber = 1;
  }

  this.previousCategoryId = this.currentCategoryId
  console.log(`currentCaategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);




 // now get the products for the given category id
  this.productService.getProductListPaginate(
    this.thePageNumber - 1,
    this.thePageSize,
    this.currentCategoryId).subscribe(this.processResult());

  }



  updatePageSize(event: Event): void {
    // You can handle the event and extract the selected page size here.
    // For example, if you are using an HTML select element to choose page size:
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    
    // Convert the selectedPageSize to a number if needed
    this.thePageSize = +selectedPageSize;
    
    // Reset the page number to 1 when the page size changes
    this.thePageNumber = 1;
    
    // Call the listProducts method to fetch data with the new page size
    this.listProducts();
  }


  processResult(){
    return  (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }


addToCart(theProduct: Product){
  console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

  const theCartItem = new CartItem(theProduct);
  this.cartService.addToCart(theCartItem);

}


}