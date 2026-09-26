import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';


@Component({
  selector: 'app-nav-footer',
  imports: [],
  templateUrl: './nav-footer.html',
  styleUrl: './nav-footer.less',
})
export class NavFooter {
  private authService = inject(AuthService);
  private router = inject(Router);

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
