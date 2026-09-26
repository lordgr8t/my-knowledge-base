import { Component, inject } from '@angular/core';
import { InputComponent } from '@components/input/input';
import { Button } from '@components/button/button';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '@core/services/auth';


export type AuthFormState = 'login' | 'register';

@Component({
  selector: 'app-auth-form',
  imports: [InputComponent, Button, FormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.less',
})


export class AuthForm {
  nowAuthFormState: AuthFormState = 'login';

  toggleAuthFormState(): void {
    this.nowAuthFormState =
      this.nowAuthFormState === 'login' ? 'register' : 'login';
    console.log(this.nowAuthFormState)
  }

  showNowState() {
    console.log(this.nowAuthFormState);
  }

  private authService = inject(AuthService);
  protected FormSubmited = false;



  auth(form: NgForm): void {
    this.FormSubmited = true;
    if (this.nowAuthFormState === 'login') {
      console.log(form.value.email);
      console.log(form.value.password);

      this.authService.login({
        email: form.value.email,
        password: form.value.password,
      }).subscribe({
        next: (res) => console.log('LOGIN OK:', res),
        error: (err) => alert(err.error.detail),
      });

    } else {
      console.log(form.value.email);
      console.log(form.value.password);
      console.log(form.value.passwordAgain);
      console.log(form.value.username);
    }
  }
}
