import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartItemService } from 'src/app/service/cart-item.service';
import { SnowShopFormService } from 'src/app/service/snow-shop-form.service';
import { Snowvalidators } from 'src/app/validators/snowvalidators';
import { CheckoutService } from 'src/app/service/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {


  checkoutFormGroup : FormGroup;

  totalPrice : number = 0;
  totalQuantity: number = 0;

  creditCardYear : number[] = [];
  creditCardMonth : number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder : FormBuilder,
              private snowShopFormService : SnowShopFormService,
              private cartService : CartItemService,
              private checkoutService : CheckoutService,
              private router : Router){}

  ngOnInit() : void {

    this.reviewCartDetails()

  this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({

        firstname: new FormControl ('', [Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]),
        lastname: new FormControl  ('', [Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]),
        email: new FormControl    ('',[Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$'), Snowvalidators.notOnlyWhitespace])
      }),

    shippingAddress: this.formBuilder.group({
    
      street: new FormControl ('',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]),
      city:   new FormControl ('',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]),
      state:  new FormControl ('',[Validators.required]),
      country:new FormControl ('',[Validators.required]),
      zipcode:new FormControl ('',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace])
    
    
    }),

    billingAddress: this.formBuilder.group({
    
      street: new FormControl ('',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]),
      city:   new FormControl ('',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]),
      state:  new FormControl ('',[Validators.required]),
      country:new FormControl ('',[Validators.required]),
      zipcode:new FormControl ('',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace])
    
    }),

    creditCard: this.formBuilder.group({
    
      cardType:        new FormControl ('',[Validators.required]),
      nameOnCard:      new FormControl ('',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]),
      CardNumber:      new FormControl ('',[Validators.required, Validators.pattern('[0-9]{16}'), Snowvalidators.notOnlyWhitespace]),
      SecurityCode:    new FormControl ('',[Validators.required, Validators.pattern('[0-9]{3}'), Snowvalidators.notOnlyWhitespace]),
      expirationMonth: new FormControl ('',[Validators.required]),
      expirationYear:  new FormControl ('',[Validators.required]),
    
    
    })
  });

  // populate credit card months

  const StartMonth: number = new Date().getMonth() + 1;
  console.log("startMonth " + StartMonth);
  this.snowShopFormService.getCreditCardMonths(StartMonth).subscribe(
    data => {
      console.log("Retrieved credit card month " + JSON.stringify(data));
      this.creditCardMonth = data;
    }
  );



  // populate countries
  this.snowShopFormService.getCountries().subscribe(
    data => {
      console.log("Retrieved countries : " + JSON.stringify(data));
      this.countries = data;
    }
  )

  


  // populate credit card year

  this.snowShopFormService.getCreditCardYear().subscribe(
    data => {
      console.log("Retrieved credit card years : " + JSON.stringify(data));
      this.creditCardYear = data;
    }
  )

}
  reviewCartDetails() {
    // subcride to cartservice.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstname');}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastname');}
  get email(){ return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet (){ return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity (){ return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState (){ return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode (){ return this.checkoutFormGroup.get('shippingAddress.zipcode');}
  get shippingAddressCountry (){ return this.checkoutFormGroup.get('shippingAddress.country');}

  get billingAddressStreet (){ return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity (){ return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState (){ return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode (){ return this.checkoutFormGroup.get('billingAddress.zipcode');}
  get billingAddressCountry (){ return this.checkoutFormGroup.get('billingAddress.country');}

  get creditCardType (){ return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardName (){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNo(){ return this.checkoutFormGroup.get('creditCard.CardNumber');}
  get creditCardSecurityCode (){ return this.checkoutFormGroup.get('creditCard.SecurityCode');}
 




  onSubmit(){
    
   
    if(this.checkoutFormGroup.invalid){ 
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    console.log("Handling the submit button");
   
  console.log(" running ");
  
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity

    // get cart items 
    const cartItems = this.cartService.cartItems

    // create orderItems from cartItem
    // - long way
    /*
    let orderItems : OrderItem[] = [];
    for (let i=0; i< cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }*/

    //- short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    
    // populate purchase - order and orderItem
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next : response => {
          alert(`Your order has been received. \n Order traking number: ${response.orderTrackingNumber}`)
        
          // reset Cart
          this.resetCart();
        
        },
        error : err => {
          alert(`There was a error : ${err.message}`);
        }
      }
    );
    
     
     //  console.log(this.checkoutFormGroup.get('customer')?.value);
     // console.log("The email address is " + this.checkoutFormGroup.get('customer.email')?.value);
  
     // console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
     // console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
}
  resetCart() {
    // reset cart data 
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products")
  }
 
  copyshppingAdressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
           .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
           this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }

  }


  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    
    // if the current year equals the selected year, then start with the current month

    let startMonth : number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.snowShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months : " + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    )
  }


  getStates(formGroupName: string){

  const formGroup = this.checkoutFormGroup.get(formGroupName);

  const countryCode = formGroup?.value.country.code;
  const countryName = formGroup?.value.country.name;

  console.log(`${formGroupName} country code: ${countryCode}`);
  console.log(`${formGroupName} country name: ${countryName}`);

  this.snowShopFormService.getStates(countryCode).subscribe(
    data => {
      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      }
        else   {
        this.billingAddressStates = data;
        }

      //  select first item by default
        formGroup?.get('state')?.setValue(data[0]);

      }
    
  )

  }

}
