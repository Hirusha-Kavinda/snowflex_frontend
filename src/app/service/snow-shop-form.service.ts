import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of} from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class SnowShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statessUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }


  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]>{
    const searchStatesUrl = `${this.statessUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseState>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
    
  }



  getCreditCardMonths(StartMonth: number): Observable<number[]>{
    let data: number [] = [];

    // build an arrat for "Month" dropdown list
    // - start at current month and loop until

    for (let theMonth = StartMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of (data);
  }



  getCreditCardYear(): Observable<number[]>{
    let data: number [] = [];

    // build an arrat for "Month" dropdown list
    // - start at current month and loop until

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of (data);
  }
}


interface GetResponseCountries{
  _embedded:{
    countries : Country [];
  }
}

interface GetResponseState{
  _embedded:{
    states : State [];
  }
}