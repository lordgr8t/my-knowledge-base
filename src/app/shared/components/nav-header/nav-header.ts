import { Component } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-nav-header',
  imports: [Button],
  templateUrl: './nav-header.html',
  styleUrl: './nav-header.less',
})
export class NavHeader {}
