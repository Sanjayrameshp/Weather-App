import { Component, inject, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../common/custom-input/custom-input.component';
import { WeatherService } from '../../services/weather.service';
import { WeatherIconPipe } from '../../common/pipes/weather-icon.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables)


@Component({
  selector: 'app-weather-data',
  imports: [CommonModule,CustomInputComponent, WeatherIconPipe, DatePipe],
  templateUrl: './weather-data.component.html',
  styleUrl: './weather-data.component.css'
})
export class WeatherDataComponent implements OnInit {

  cityName : string = 'New York';
  lattitude : string = '';
  longittude : string = '';
  currentweatherData : any;
  iconUrl : string = '';
  hourlyWeatherData: any;
  daysWeatherData: any;
  barChartLabel : string[] = [];
  barChartData : string[] = [];
  chartInstance: any = null;

  private weatherService = inject(WeatherService)

  ngOnInit(): void {
    this.getWeatherData()
  }

  onCitNameChange(value: any) {
    this.cityName = value;
  }

  getWeatherData() {
    if(this.cityName) {
      this.weatherService.showloading(true);
      //  to get lattittude & longittude of city
      this.weatherService.getGeoLocation(this.cityName).subscribe((response:any) => {
        console.log("RESPONSE ... ", response);
        
        if(response && response.length>0) {
          this.lattitude = response[0].lat;
          this.longittude = response[0].lon;

          let coordinates = {
            lat : this.lattitude,
            long : this.longittude
          }

          // to get current weather data based on lat & long
          this.weatherService.getCurrentWeatherData(coordinates).subscribe((response) => {
            if(response) {
              this.currentweatherData = response;
              this.iconUrl = "https://openweathermap.org/img/wn/" + this.currentweatherData.weather[0].icon +"@2x.png";

              this.weatherService.showloading(false);

              // to get hourly weather data
              this.weatherService.getHourlyweatherdata(coordinates).subscribe((hourlyData:any) => {
                if(hourlyData) {
                  this.hourlyWeatherData = hourlyData.list;
                  this.barChartLabel = [];
                  this.barChartData = [];
                  const sortedData = [...this.hourlyWeatherData].sort((a: any, b: any) => {
                    return new Date(a.dt_txt).getTime() - new Date(b.dt_txt).getTime();
                  });
                  this.hourlyWeatherData = sortedData.length > 6 ? sortedData.splice(0,6) : sortedData;
                  
                  // for bar chart

                  this.hourlyWeatherData.forEach((item:any) => {
                    this.barChartData.push(item.main.temp.toString());
                  
                    const timestamp = item.dt * 1000;
                    const date = new Date(timestamp);
                    const formattedTime = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                  
                    this.barChartLabel.push(formattedTime);
                  });

                  setTimeout(() => {
                    this.RenderBarChart(this.barChartLabel, this.barChartData);
                  }, 0);

                } else {
                  this.weatherService.showloading(false);
                  this.hourlyWeatherData = [];
                  this.weatherService.showAlertMessage('warn', 'Error while getting HOURLY weather data', 3000);
                  console.log("CANNOT GET HOURLY WEATHER DATA");
                }
              })
              
            } else {
              this.weatherService.showloading(false);
              this.currentweatherData = [];
              this.weatherService.showAlertMessage('error', 'Error while getting weather data!', 3000)
              console.log("CANNOT GET CURRENT WEATHER DATA");
            }
          })
        } else {
          this.weatherService.showloading(false);
          this.weatherService.showAlertMessage('error', 'Invalid city name / try other city names', 3000);
          console.log("CANNOT GET CITY NAME");
        }
      })
    } else{
      this.weatherService.showloading(false);
      this.weatherService.showAlertMessage('info', 'Please enter a city name', 3000);
    }
  }

  //  Function for rendering the line chart
  RenderBarChart(labelData: string[], valueData: string[]) {
  // Destroy old chart if it exists
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  // Create and assign new chart instance
  this.chartInstance = new Chart('bar-chart', {
    type: 'bar',
    data: {
      labels: labelData,
      datasets: [
        {
          label: 'Hourly Weather Data (Time vs Temperature °C)',
          data: valueData,
          backgroundColor: '#8d9ead'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


}
