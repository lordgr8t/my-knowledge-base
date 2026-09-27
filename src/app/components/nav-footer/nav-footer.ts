import { Component, HostListener, inject, signal } from '@angular/core';
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

  readonly username = signal(this.authService.getCurrentUser()?.username ?? 'Пользователь');
  readonly isSettingsMenuOpen = signal(false);

  toggleSettingsMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isSettingsMenuOpen.update((isOpen) => !isOpen);
  }

  closeSettingsMenu() {
    this.isSettingsMenuOpen.set(false);
  }

  @HostListener('document:click')
  closeSettingsMenuOnOutsideClick() {
    this.closeSettingsMenu();
  }

  @HostListener('document:keydown.escape')
  closeSettingsMenuOnEscape() {
    this.closeSettingsMenu();
  }

  logOut() {
    this.closeSettingsMenu();
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
