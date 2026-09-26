import { Component, Input} from '@angular/core';

export type ButtonType = 'default' | 'add' | 'share' | 'share-settings' | 'options' | 'edit' | 'filled';
export type ButtonPosition = 'default' | 'left' | 'center' | 'right';
export type ButtonFormType = 'submit' | null;

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.less',
})
export class Button {
  @Input() type: ButtonType = 'default';
  @Input() disabled = false;
  @Input() position:ButtonPosition = 'default';
  @Input() formType:ButtonFormType = null;
}
