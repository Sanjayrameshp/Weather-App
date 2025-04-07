import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-input',
  imports: [],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css'
})
export class CustomInputComponent {

  @Input() label !: string;
  @Input() type : string = 'text';
  @Input() inputValue : any = '';

  @Output() valueChange = new EventEmitter<any>();

  onInputValueChange(event: any) {
    let value = event.target.value
    this.valueChange.emit(value);
  }

}
