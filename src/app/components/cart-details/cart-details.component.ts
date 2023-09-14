import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartItemService } from 'src/app/service/cart-item.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent {

  cartItems : CartItem[] = [];
  totalPrice: number = 0;
  totalQuntity: number = 0;

  constructor(private cartService: CartItemService){}

  ngOnInit(){
    this.listCartDetails();
  }


  listCartDetails() {
   // get a handle to  the cart items
   this.cartItems = this.cartService.cartItems;


    // subcribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
       );

   // subcribe to the cart totalQuntity
   this.cartService.totalQuantity.subscribe(
  data => this.totalQuntity = data
   );

   // compute cart total price and quantity
   this.cartService.computeCartTotals();
  }


  incrementQuantity(theCartItem : CartItem){
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuntity(theCartItem)
  }
}
