import { Product } from "./product";

export class CartItem {

    id : number;
    name : string;
    imageUrl : string;
    unitPrice: number;
    quntitry : number;
  cartItems: any;

    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.quntitry = 1;

    }

}
