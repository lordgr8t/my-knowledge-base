import { Component } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-editor-header',
  imports: [Button],
  templateUrl: './editor-header.html',
  styleUrl: './editor-header.less',
})
export class EditorHeader {}
