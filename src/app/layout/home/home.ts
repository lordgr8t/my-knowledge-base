import { Component, inject } from '@angular/core';
import { NavTree } from '@components/nav-tree/nav-tree';
import { NavFooter } from '@components/nav-footer/nav-footer';
import { EditorWrapper } from '@components/editor-wrapper/editor-wrapper';


import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-home',
  imports: [NavTree, NavFooter, EditorWrapper],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {

  private authService = inject(AuthService);
  private router = inject(Router);
  ngOnInit() {
    if (!this.authService.getAccessToken()) {
      this.router.navigateByUrl('/auth');
    }
  }
}
