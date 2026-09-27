import { Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
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
  @Output() createArticle = new EventEmitter<void>();
  @Output() deleteArticle = new EventEmitter<void>();

  @Input() isEditing = false;
  @Input() breadcrumbs: string[] = [];
  @Input() hasSelectedArticle = false;

  isOptionsMenuOpen = false;

  toggleEditorMode() {
    this.toggleEditor.emit();
  }

  formatBreadcrumb(title: string): string {
    return title.length > 33 ? `${title.slice(0, 33)}...` : title;
  }

  toggleOptionsMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isOptionsMenuOpen = !this.isOptionsMenuOpen;
  }

  requestDeleteArticle() {
    this.isOptionsMenuOpen = false;
    this.deleteArticle.emit();
  }

  @HostListener('document:click')
  closeOptionsMenu() {
    this.isOptionsMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeOptionsMenuOnEscape() {
    this.isOptionsMenuOpen = false;
  }

}
