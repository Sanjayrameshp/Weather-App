import { Routes } from '@angular/router';
import { WeatherDataComponent } from './components/weather-data/weather-data.component';
import { AirQualityComponent } from './components/air-quality/air-quality.component';
import { WeatherMapsComponent } from './components/weather-maps/weather-maps.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

export const routes: Routes = [
    { path: '', redirectTo : 'home', pathMatch: 'full' },
    { path: 'home', component : WeatherDataComponent },
    { path: 'aqi', component : AirQualityComponent},
    { path: 'maps', component : WeatherMapsComponent},
    { path: 'about-us', component : AboutUsComponent}
];
