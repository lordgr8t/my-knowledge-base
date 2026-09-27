import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '@components/input/input';
import { Button } from '@components/button/button';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '@core/services/auth';
import { finalize } from 'rxjs';


export type AuthFormState = 'login' | 'register';

@Component({
  selector: 'app-auth-form',
  imports: [InputComponent, Button, FormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.less',
})


export class AuthForm {


  nowAuthFormState: AuthFormState = 'login';
  isSubmitted = false;
  isSubmitting = signal(false);
  formError = signal<string | null>(null);

  toggleAuthFormState(form: NgForm): void {
    this.nowAuthFormState =
      this.nowAuthFormState === 'login' ? 'register' : 'login';
    this.isSubmitted = false;
    this.formError.set(null);
    form.resetForm();
  }



  private authService = inject(AuthService);
  private router = inject(Router);
  auth(form: NgForm): void {
    this.isSubmitted = true;
    this.formError.set(null);
    if (form.invalid || this.isPasswordMismatch(form)) return;

    this.isSubmitting.set(true);
    if (this.nowAuthFormState === 'login') {
      this.authService.login({
        email: String(form.value.email).trim(),
        password: form.value.password,
      }).pipe(finalize(() => {
        this.isSubmitting.set(false);
      })).subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          this.formError.set(error.error?.detail ?? 'Не удалось войти. Проверьте данные и попробуйте ещё раз.');
        },
      });
    } else {
      this.authService.register({
        username: String(form.value.username).trim(),
        password: form.value.password,
        email: String(form.value.email).trim(),
      }).pipe(finalize(() => {
        this.isSubmitting.set(false);
      })).subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          this.formError.set(error.error?.detail ?? 'Не удалось зарегистрироваться. Попробуйте ещё раз.');
        },
      });
    }
  }

  isPasswordMismatch(form: NgForm): boolean {
    return this.nowAuthFormState === 'register'
      && !!form.value.passwordAgain
      && form.value.password !== form.value.passwordAgain;
  }

}
