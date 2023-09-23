import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartItemService } from 'src/app/service/cart-item.service';
import { SnowShopFormService } from 'src/app/service/snow-shop-form.service';
import { Snowvalidators } from 'src/app/validators/snowvalidators';

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
              private cartService : CartItemService){}

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
    console.log("Handling the submit button");
    if(this.checkoutFormGroup.invalid){ 
      this.checkoutFormGroup.markAllAsTouched();

    }
    
     
      console.log(this.checkoutFormGroup.get('customer')?.value);
      console.log("The email address is " + this.checkoutFormGroup.get('customer.email')?.value);
  
      console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
      console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
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
