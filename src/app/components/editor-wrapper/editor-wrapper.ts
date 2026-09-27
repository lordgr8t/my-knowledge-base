import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideTuiEditor, TUI_EDITOR_DEFAULT_TOOLS, TuiEditor } from '@taiga-ui/editor';
import { Article } from '@core/models/article.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

export class EditorWrapper implements OnChanges, OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly tools = TUI_EDITOR_DEFAULT_TOOLS;
  readonly control = new FormControl('', { nonNullable: true });

  @Input({ required: true }) state!: EditorState;
  @Input() article: Article | null = null;
  @Input() stateBool = false;
  @Output() contentChange = new EventEmitter<string>();
  @Output() titleChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((content) => {
        this.contentChange.emit(content);
        this.titleChange.emit(this.getFirstLine(content));
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
      this.stateBool = this.state === 'read';
    }
    if (changes['article']) {
      const content = this.buildEditorContent(this.article);
      this.control.setValue(content, { emitEvent: false });
      this.contentChange.emit(content);
      this.titleChange.emit(this.article?.title ?? '');
    }
  }

  private buildEditorContent(article: Article | null): string {
    if (!article) return '';

    const template = document.createElement('template');
    template.innerHTML = article.content;
    const firstBlock = template.content.firstElementChild;
    if ((firstBlock?.tagName === 'H1' || firstBlock?.tagName === 'H2')
      && firstBlock.textContent?.trim() === article.title.trim()) {
      return template.innerHTML;
    }

    const heading = document.createElement('h1');
    heading.textContent = article.title;
    template.content.prepend(heading);
    return template.innerHTML;
  }

  private getFirstLine(content: string): string {
    const template = document.createElement('template');
    template.innerHTML = content;
    return template.content.firstElementChild?.textContent?.trim() ?? '';
  }

}