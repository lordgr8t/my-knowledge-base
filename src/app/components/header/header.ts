import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Button } from '../button/button';


export type HeaderState = 'auth' | 'home';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.less',
})
export class Header {

  @Input() headerState:HeaderState = 'auth';
  
  @Output() toggleEditor = new EventEmitter<void>();

  isEditing = false;

  toggleEditorMode() {
    this.isEditing = !this.isEditing;
    this.toggleEditor.emit();
  }

}
