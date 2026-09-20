import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavHeader } from './shared/components/nav-header/nav-header';
import { NavTree } from './shared/components/nav-tree/nav-tree';
import { NavFooter } from './shared/components/nav-footer/nav-footer';
import { EditorHeader } from './shared/components/editor-header/editor-header';
import { EditorWrapper } from './shared/components/editor-wrapper/editor-wrapper';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavHeader, NavTree, NavFooter, EditorHeader, EditorWrapper],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected readonly title = signal('my-knowledge-base');
}
