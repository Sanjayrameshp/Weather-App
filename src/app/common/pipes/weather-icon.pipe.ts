import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherIcon'
})
export class WeatherIconPipe implements PipeTransform {

  transform(value: string) {
    if(!value) {
      return
    }
    let imageUrl = "https://openweathermap.org/img/wn/" + value +"@2x.png";
    return imageUrl;
  }

}
