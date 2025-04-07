import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-maps',
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-maps.component.html',
  styleUrl: './weather-maps.component.css'
})
export class WeatherMapsComponent {

  private map: any;
  private currentLayer: any;

  private weatherService = inject(WeatherService);

  layers = [
    { label: 'Clouds', value: 'clouds_new' },
    { label: 'Temperature', value: 'temp_new' },
    { label: 'Precipitation', value: 'precipitation_new' },
    { label: 'Wind', value: 'wind_new' },
    { label: 'Pressure', value: 'pressure_new' },
    { label: 'Snow', value: 'snow' }
  ];

  selectedLayer = this.layers[0].value;

  async ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    const L = await import('leaflet');

    this.map = L.map('weatherMap').setView([20.5937, 78.9629], 5);

    // Base map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.addWeatherLayer(L, this.selectedLayer);
  }

  async addWeatherLayer(L: any, layer: string) {
    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }

    const url = this.weatherService.getLayerUrl(layer);
    this.currentLayer = L.tileLayer(url, {
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
    });

    this.currentLayer.addTo(this.map);
  }

  async changeLayer() {
    const L = await import('leaflet');
    this.addWeatherLayer(L, this.selectedLayer);
  }

}
