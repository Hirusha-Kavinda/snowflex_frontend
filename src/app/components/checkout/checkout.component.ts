import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { SnowShopFormService } from 'src/app/service/snow-shop-form.service';

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
              private snowShopFormService : SnowShopFormService){}

  ngOnInit() : void {

    this.checkoutFormGroup = this.formBuilder.group({
    customer : this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      email: ['']
    }),

    shippingAddress: this.formBuilder.group({
    
      street: [''],
      city: [''],
      state: [''],
      country:[''],
      zipcode:['']
    
    
    }),

    billingAddress: this.formBuilder.group({
    
      street: [''],
      city: [''],
      state: [''],
      country:[''],
      zipcode:['']
    
    
    }),

    creditCard: this.formBuilder.group({
    
      cardType: [''],
      nameOnCard: [''],
      CardNumber: [''],
      SecurityCode:[''],
      expirationMonth:[''],
      expirationYear:['']
    
    
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

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value)
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email)
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);

  }
 
  copyshppingAdressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
           .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
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
