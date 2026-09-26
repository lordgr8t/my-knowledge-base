import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideTuiEditor, TUI_EDITOR_DEFAULT_TOOLS, TuiEditor } from '@taiga-ui/editor';

// @Component({
//   selector: 'app-editor-wrapper',
//   imports: [TuiEditor, ReactiveFormsModule],
//   templateUrl: './editor-wrapper.html',
//   styleUrl: './editor-wrapper.less',
// })
// export class EditorWrapper {}


export type EditorState = "read" | "write";

@Component({
  selector: 'app-editor-wrapper',

  standalone: true,
  imports: [
    TuiEditor,
    ReactiveFormsModule,
  ],
  templateUrl: './editor-wrapper.html',
  styleUrl: './editor-wrapper.less',
  providers: [
    provideTuiEditor({
      // You can disable these plugins
      // if you don't need them
      image: true,
      iframe: true,
      video: true,
      source: true,
      audio: true,
      details: true,
      detailsSummary: true,
      detailsContent: true,
    }),
  ]
})

export class EditorWrapper {
  readonly tools = TUI_EDITOR_DEFAULT_TOOLS;
  readonly control = new FormControl();

  editorState: EditorState = "read";
  
  get editorStateSetting(): boolean {
    return this.editorState === 'read';
  }
  
  toggleEditorState(){
    this.editorState =
      this.editorState === 'read' ? 'write' : 'read';
    console.log(this.editorState)
  }
}