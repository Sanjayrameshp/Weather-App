import { Component, OnInit, inject } from '@angular/core';
import { CustomInputComponent } from '../../common/custom-input/custom-input.component';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { GetPollutantNamePipe } from '../../common/pipes/get-pollutant-name.pipe';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables)

interface AirQualityComponents {
  co?: number;
  nh3?: number;
  no?: number;
  no2?: number;
  o3?: number;
  pm2_5?: number;
  pm10?: number;
  so2?: number;
}
interface AirQualityEntry {
  key: string;
  value: string;
}

@Component({
  selector: 'app-air-quality',
  imports: [CommonModule,CustomInputComponent,GetPollutantNamePipe],
  templateUrl: './air-quality.component.html',
  styleUrl: './air-quality.component.css',
})
export class AirQualityComponent implements OnInit {

  cityName : string = 'New York';
  lattitude : string = '';
  longittude : string = '';
  currentAQIData : any = {};
  airQualityDesc : string = '';
  airQualityComponents: AirQualityComponents = {};
  airQualityArray: AirQualityEntry[] = [];
  pieChartLabel : string[] = [];
  pieChartData : string[] = [];
  pieChart : any = null;
  

  qualitativeData: { [key: number]: string } = {
    1 : "Good",
    2 : "Fair",
    3 : "Moderate",
    4 : "Poor",
    5 : "Very Poor"
  }

  private weatherService = inject(WeatherService)

  ngOnInit(): void {
    this.getAirQualityIndex()
  }

  getCityName(data:string) {
    this.cityName = data;
  }

  getAirQualityIndex() {
    if (this.cityName) {
      this.weatherService.showloading(true);
      this.weatherService.getGeoLocation(this.cityName).subscribe((response:any) => {
      
        if(response && response.length > 0) {
          this.lattitude = response[0].lat;
          this.longittude = response[0].lon;
          
          let coordinates = {
            lat : this.lattitude,
            long : this.longittude
          }
          this.weatherService.getAirQualityIndex(coordinates).subscribe((indexData:any) => {
            if(indexData) {
              this.currentAQIData = indexData;
              this.weatherService.showloading(false);
              console.log("this.currentAQIData ", this.currentAQIData);
              
              let indexValue = this.currentAQIData.list[0].main.aqi;
              this.pieChartData = [];
              this.pieChartLabel = [];
  
              this.airQualityDesc = this.qualitativeData[indexValue];
              this.airQualityComponents = this.currentAQIData.list[0].components;
              this.airQualityArray = Object.entries(this.airQualityComponents).map(
                ([key, value]) => ({
                  key,
                  value
                })
              );
  
              // set piechart
              this.airQualityArray.forEach((item:AirQualityEntry) => {
                this.pieChartLabel.push(item.key)
                this.pieChartData.push(item.value)
              })
              
              this.RenderPieChart(this.pieChartLabel, this.pieChartData)
  
            } else {
              this.weatherService.showloading(false);
              this.currentAQIData = {};
              this.weatherService.showAlertMessage('error', 'Error while getting Air Quality index', 3000)
            }
          })
          
        } else {
          this.weatherService.showloading(false);
          this.weatherService.showAlertMessage('error', 'Invalid city name / try other city names', 3000)
        }
      })
    } else {
      this.weatherService.showloading(false);
      this.weatherService.showAlertMessage('info', 'Please enter a city name', 3000)
    }
  }


  // Function for rendering the chart
  RenderPieChart(labelData:string[], valueData: string[]) {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    this.pieChart = new Chart('pie-chart',{
      type: 'pie',
      data: {
        labels: labelData,
        datasets: [
          {
            data: valueData
          }
        ]
      },
      options: {

      }

    })
  }
}
