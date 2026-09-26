import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth';
import { Header } from '@components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected readonly title = signal('my-knowledge-base');


  private authService = inject(AuthService);

  // ngOnInit() {
  //   // Тест логина
  //   this.authService.login({
  //     email: 'test@test.com',
  //     password: '123456',
  //   }).subscribe({
  //     next: (res) => console.log('LOGIN OK:', res),
  //     error: (err) => console.error('LOGIN ERR:', err),
  //   });

  //   console.log(this.authService.getCurrentUser());
  // }
}