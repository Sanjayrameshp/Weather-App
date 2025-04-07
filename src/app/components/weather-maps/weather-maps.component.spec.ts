import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherMapsComponent } from './weather-maps.component';

describe('WeatherMapsComponent', () => {
  let component: WeatherMapsComponent;
  let fixture: ComponentFixture<WeatherMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherMapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
