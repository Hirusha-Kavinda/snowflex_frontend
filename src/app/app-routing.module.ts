import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import{ OktaAuthModule,OktaCallbackComponent, OKTA_CONFIG} from '@okta/okta-angular';
import myAppConfig from './config/my-app-config';
import { OktaAuth } from '@okta/okta-auth-js';
import { LoginComponent } from './components/login/login.component';


const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

const routes: Routes = [
  {path : 'login/callback', component : OktaCallbackComponent},
  {path : 'login' , component : LoginComponent},
  {path : 'checkout' , component: CheckoutComponent},
  {path : 'search/:keyword', component: ProductListComponent},
  {path : 'products', component: ProductListComponent},
  {path : '', redirectTo : '/products', pathMatch:'full'},
  {path : 'category/:id', component: ProductListComponent},
  {path : 'category', component: ProductListComponent},
  {path : 'products/:id', component: ProductDetailsComponent},
  {path : 'cart-details', component: CartDetailsComponent},



  {path : '**', redirectTo : '/products', pathMatch:'full'},
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
