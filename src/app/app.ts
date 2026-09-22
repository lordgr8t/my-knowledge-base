import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavHeader } from './shared/components/nav-header/nav-header';
import { NavTree } from './shared/components/nav-tree/nav-tree';
import { NavFooter } from './shared/components/nav-footer/nav-footer';
import { EditorHeader } from './shared/components/editor-header/editor-header';
import { EditorWrapper } from './shared/components/editor-wrapper/editor-wrapper';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavHeader, NavTree, NavFooter, EditorHeader, EditorWrapper, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected readonly title = signal('my-knowledge-base');


  private authService = inject(AuthService);

  ngOnInit() {
    // Тест логина
    this.authService.login({
      email: 'test@test.com',
      password: '123456',
    }).subscribe({
      next: (res) => console.log('LOGIN OK:', res),
      error: (err) => console.error('LOGIN ERR:', err),
    });
  }
}