import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthForm } from '@components/auth-form/auth-form';
import { AuthService } from '@core/services/auth';



@Component({
  selector: 'app-auth',
  imports: [AuthForm],
  templateUrl: './auth.html',
  styleUrl: './auth.less',
})
export class Auth {

  private authService = inject(AuthService);
  private router = inject(Router);
  ngOnInit() {
    if (this.authService.getAccessToken()) {
      this.router.navigateByUrl('/home');
    }
  }
}
