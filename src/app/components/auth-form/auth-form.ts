import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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



  private authService = inject(AuthService);
  private router = inject(Router);
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
        next: (res) => {
          console.log('LOGIN OK:', res);
          this.router.navigateByUrl('/home');
        },
        error: (err) => alert(err.error.detail),
      });

    } else {

      this.authService.register({
        username: form.value.username,
        password: form.value.password,
        email: form.value.email
      }).subscribe({
        next: (res) => {
          console.log('LOGIN OK:', res);
          this.router.navigateByUrl('/home');
        },
        error: (err) => alert(err.error.detail)
      })

      console.log(form.value.passwordAgain);
    }
  }


  
}
