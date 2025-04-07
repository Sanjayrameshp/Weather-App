import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from "./components/footer/footer.component";
import { MessagesModule } from 'primeng/messages';
import { WeatherService} from '../app/services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent, MessagesModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private weatherService = inject(WeatherService)
  title = 'weather-app';
  messages = computed(() => this.weatherService.getAlertMessages());
  isLoading = computed(() => this.weatherService.isLoading())

}
