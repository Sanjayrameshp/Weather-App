import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, throwError, Subject} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Message } from '../../app/models/message'

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private dayUrl = 'https://ai-weather-by-meteosource.p.rapidapi.com/daily';
  private API_KEY = "15e129e8f7014d71ed0760ba77b02304";

  private alertMessage = signal<Message[]>([]);
  private loading = signal<boolean>(false);

  private http = inject(HttpClient)

  constructor() { }

  // Functionality for getting geo location co-ordinates.
  getGeoLocation(cityName: string) {
    const url = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + this.API_KEY;
    return this.http.get(url).pipe(
      tap((data) => {
        console.log(`GET GEO LOCATION Request:`, data);
      }),
      catchError(this.handleError)
    );
  }

  // Functionality for getting current weather data.
  getCurrentWeatherData(data: {lat: string, long: string}) {
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + data.lat + "&lon=" + data.long + "&appid=" + this.API_KEY + "&units=metric";
    return this.http.get(url).pipe(
      tap((data) => {
        console.log(`GET CURRENT WEATHER Request:`, data);
        
      }),catchError(this.handleError)
    )
  }

  // Functionalty for getting hourly weather data.
  getHourlyweatherdata(data:{lat:string,long:string}) {
    const url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + data.lat +"&lon=" + data.long + "&appid=" + this.API_KEY + "&units=metric"
    return this.http.get(url).pipe(
      tap((data) => {
        console.log(`GET HOURLY WEATHER Request:`, data)
      }),catchError(this.handleError)
    )
  }

  // Functionality for getting Days weather data
  getWeatherDataByDay(data:{lat:string,long:string}) {
    const options = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': '1fff8bd0cdmshb40f0dba7e6d303p154e36jsn47180d50cdf9',
        'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
      })
    };

    const url = `${this.dayUrl}?lat=${data.lat}&lon=${data.long}&language=en&units=metric`;

    return this.http.get<any>(url, options).pipe(
      tap((data) => {
        console.log(`GET DAY WEATHER Request:`, data)
      }),catchError(this.handleError)
    )
  }

  // For getting Air Quality Index
  getAirQualityIndex(data:{lat:string,long:string}) {
    const url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=" + data.lat + "&lon=" + data.long + "&appid=" + this.API_KEY;
    return this.http.get(url).pipe(
      tap((data) => {

      }),
      catchError(this.handleError)
    )
  }

  // For getting Historical AQI
  getHistoricalAQI(data:{lat:string,long:string}, time: {startDate: any,endDate:any}) {
    const url = "http://api.openweathermap.org/data/2.5/air_pollution/history?lat=" + data.lat + "&lon=" + data.long + "&start=" + time.startDate + "&end=" + time.endDate + "&appid=" + this.API_KEY;
    return this.http.get(url).pipe(
      tap((data) => {

      }),
      catchError(this.handleError)
    )
  }

  // For getting Historical AQI
  forcastAQI(data:{lat:string,long:string}) {
    const url = "http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + data.lat + "&lon=" + data.long + "&appid=" + this.API_KEY;
    return this.http.get(url).pipe(
      tap((data) => {

      }),
      catchError(this.handleError)
    )
  }

  getApiKey(): string {
    return this.API_KEY;
  }

  getLayerUrl(layer: string): string {
    return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${this.API_KEY}`;
  }

  // Function for show Alert Message
  showAlertMessage(type:Message['severity'], message: string, duration: number) {
    const messageModel = {
      severity: type,
      summary: message,
      life: duration
    }
    this.alertMessage.set([messageModel])
  }

  get getAlertMessages() {
    return this.alertMessage.asReadonly();
  }
  clearMessages() {
    this.alertMessage.set([]);
  }

  // Function for show loading
  showloading(value: boolean) {
    this.loading.set(value)
  }

  isLoading () {
    return this.loading();
  }

  private handleError(error: any) {
    console.error('Error fetching geo location:', error);
    return throwError(() => new Error(error.message || 'Something went wrong!'));
  }


}
