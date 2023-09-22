import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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
              private snowShopFormService : SnowShopFormService){}

  ngOnInit() : void {

  this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstname: ['', 
        [Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]
      ],

        lastname: ['',
         [Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace
        ]],

        email: ['',
         [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$'), Snowvalidators.notOnlyWhitespace
        ]]
      }),

    shippingAddress: this.formBuilder.group({
    
      street: ['',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]],
      city:   ['',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]],
      state:  ['',[Validators.required]],
      country:['',[Validators.required]],
      zipcode:['',[Validators.required, Validators.minLength(3), Snowvalidators.notOnlyWhitespace]]
    
    
    }),

    billingAddress: this.formBuilder.group({
    
      street: ['',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]],
      city:   ['',[Validators.required, Validators.minLength(2), Snowvalidators.notOnlyWhitespace]],
      state:  ['',[Validators.required]],
      country:['',[Validators.required]],
      zipcode:['',[Validators.required, Validators.minLength(3), Snowvalidators.notOnlyWhitespace]]
    
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

get firstName(){ 
  return this.checkoutFormGroup.get('customer.firstname');}
get lastName(){ 
  return this.checkoutFormGroup.get('customer.lastname');}
get email(){ 
  return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet (){ return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity (){ return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState (){ return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode (){ return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry (){ return this.checkoutFormGroup.get('shippingAddress.country');}

  get billingAddressStreet (){ return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity (){ return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState (){ return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode (){ return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get billingAddressCountry (){ return this.checkoutFormGroup.get('billingAddress.country');}




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
