import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {

  cartItems : CartItem[] =[];

  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> =new BehaviorSubject<number>(0);

  constructor() { }


addToCart(theCartItem: CartItem){

  let alreadyExistsInCart: boolean = false;
  let existingCartItem: CartItem | undefined;

  if(this.cartItems.length > 0){
  existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id)  
  alreadyExistsInCart = (existingCartItem != undefined);

  }
  if (alreadyExistsInCart){
    existingCartItem!.quntitry++;
  }
  else{
    this.cartItems.push(theCartItem)
  }
  this.computeCartTotals();

}


decrementQuntity(theCartItem: CartItem){

  theCartItem.quntitry --;

  if (theCartItem.quntitry === 0){
    this.remove(theCartItem)
  }
  else{
    this.computeCartTotals();
  }

}


remove(theCartItem: CartItem){
  // get index of item in the array
  const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)

  // if found , remove the item from the array at the given index
  if(itemIndex > -1){
    theCartItem.cartItems.splice(itemIndex, 1);

    this,this.computeCartTotals();

  }
}

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuntityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quntitry * currentCartItem.unitPrice;
      totalQuntityValue += currentCartItem.quntitry
    }

    //publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuntityValue);
  
  this.logCartData(totalPriceValue, totalQuntityValue);
  }
  logCartData(totalPriceValue: number, totalQuntityValue: number) {
    console.log('contents of the cart');
    for (let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quntitry * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quntitry}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuntity: ${totalQuntityValue}`);
    console.log('-------')
  }


}
