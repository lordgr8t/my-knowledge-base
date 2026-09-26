import { Component } from '@angular/core';
import { NavTree } from '@components/nav-tree/nav-tree';
import { NavFooter } from '@components/nav-footer/nav-footer';
import { EditorWrapper } from '@components/editor-wrapper/editor-wrapper';

@Component({
  selector: 'app-home',
  imports: [NavTree, NavFooter, EditorWrapper],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {}
