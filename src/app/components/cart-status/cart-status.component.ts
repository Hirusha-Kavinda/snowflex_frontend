import { Component } from '@angular/core';
import { CartItemService } from 'src/app/service/cart-item.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent {

  totalPrice: number = 0.00;
  totalQuantity: number = 0 ;

  constructor(private cartService : |CartItemService){}



  ngOnInit(){
    this.updateCartStatus()
  }

  
  updateCartStatus() {
    
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
     
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

  }

}
