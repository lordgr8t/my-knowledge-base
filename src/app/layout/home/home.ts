import { Component, inject, signal } from '@angular/core';
import { NavTree } from '@components/nav-tree/nav-tree';
import { NavFooter } from '@components/nav-footer/nav-footer';
import { EditorWrapper } from '@components/editor-wrapper/editor-wrapper';
import { Header } from '@components/header/header'
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';
import { ArticleService } from '@core/services/article';
import { Article } from '@core/models/article.model';
import { finalize, timeout } from 'rxjs';

export type EditorState = "read" | "write";

@Component({
  selector: 'app-home',
  imports: [NavTree, NavFooter, EditorWrapper, Header],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {
  private authService = inject(AuthService);
  private articleService = inject(ArticleService);
  private router = inject(Router);
  ngOnInit() {
    if (!this.authService.getAccessToken()) {
      this.router.navigateByUrl('/auth');
    }
  }

  editorState: EditorState = "read";

  toggleEditorState() {
    const shouldSave = this.editorState === 'write';
    this.editorState =
      this.editorState === 'read' ? 'write' : 'read';

    const selectedArticle = this.selectedArticle();
    if (shouldSave && selectedArticle) {
      const articleId = selectedArticle.id;
      this.articleService.updateArticle(articleId, {
        title: selectedArticle.title,
        content: this.draftContent,
        parentId: selectedArticle.parentId,
      }).subscribe({
        next: (article) => {
          if (this.selectedArticleId() !== articleId) return;
          this.selectedArticle.set(article);
          this.draftContent = article.content;
        },
        error: (error) => {
          console.error('Не удалось сохранить статью:', error);
        },
      });
    }
  }


  get editorStateSetting(): boolean {
    return this.editorState === 'read';
  }

  selectedArticle = signal<Article | null>(null);
  selectedArticleId = signal<number | null>(null);
  draftContent = '';
  isLoadingArticle = signal(false);
  articleLoadError = signal<string | null>(null);
  private articleRequestSequence = 0;

  selectArticle(articleId: number) {
    const requestSequence = ++this.articleRequestSequence;
    this.selectedArticleId.set(articleId);
    this.selectedArticle.set(null);
    this.draftContent = '';
    this.isLoadingArticle.set(true);
    this.articleLoadError.set(null);
    this.articleService.getArticle(articleId).pipe(
      timeout({ first: 15000 }),
      finalize(() => {
        if (requestSequence === this.articleRequestSequence) {
          this.isLoadingArticle.set(false);
        }
      }),
    ).subscribe({
      next: (article) => {
        if (requestSequence !== this.articleRequestSequence) return;
        this.selectedArticle.set(article);
        this.draftContent = article.content;
      },
      error: (error) => {
        if (requestSequence !== this.articleRequestSequence) return;
        this.articleLoadError.set(error.status === 401
          ? 'Сессия завершилась. Войдите снова.'
          : 'Не удалось загрузить статью. Проверьте соединение и попробуйте ещё раз.');
        console.error('Не удалось загрузить статью:', error);
      },
    });
  }

  updateDraft(content: string) {
    this.draftContent = content;
  }
}
