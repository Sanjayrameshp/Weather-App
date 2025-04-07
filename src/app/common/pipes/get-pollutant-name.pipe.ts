import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getPollutantName'
})
export class GetPollutantNamePipe implements PipeTransform {

  transform(value: string) {
    if(value == 'co') { return 'Carbon Monoxide'; }
    else if(value == 'nh3') { return 'Ammonia'; }
    else if(value == 'no') { return 'Nitric Oxide'; }
    else if(value == 'no2') { return 'Nitrogen Dioxide'; }
    else if(value == 'o3') { return 'Ozone'; }
    else if(value == 'pm2_5') { return 'Particulate Matter (<2.5 µm)'; }
    else if(value == 'pm10') { return 'Particulate Matter (<10 µm)'; }
    else if(value == 'so2') { return 'Sulfur Dioxide'; }
    else {
      return value;
    }
  }

}
