import { Component, Input} from '@angular/core';

export type ButtonType = 'default' | 'add' | 'share' | 'share-settings' | 'options' | 'edit';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.less',
})
export class Button {
  @Input() type: ButtonType = 'default';
  @Input() disabled = false;
}
