import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavTree } from '@components/nav-tree/nav-tree';
import { NavFooter } from '@components/nav-footer/nav-footer';
import { EditorWrapper } from '@components/editor-wrapper/editor-wrapper';
import { Header } from '@components/header/header'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth';
import { ArticleService } from '@core/services/article';
import { Article } from '@core/models/article.model';
import { finalize, timeout } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    if (!this.authService.getAccessToken()) {
      this.router.navigateByUrl('/auth');
    }

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const rawArticleId = params.get('articleId');
      if (rawArticleId === null) {
        this.articleRequestSequence++;
        this.selectedArticleId.set(null);
        this.selectedArticle.set(null);
        this.isLoadingArticle.set(false);
        this.articleLoadError.set(null);
        this.breadcrumbs.set([]);
        return;
      }

      const articleId = Number(rawArticleId);
      if (!Number.isSafeInteger(articleId) || articleId < 1) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
        return;
      }

      if (this.selectedArticleId() === articleId && (this.selectedArticle() || this.isLoadingArticle())) return;
      this.loadArticle(articleId);
    });
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
        title: this.draftTitle,
        content: this.draftContent,
        parentId: selectedArticle.parentId,
      }).subscribe({
        next: (article) => {
          if (this.selectedArticleId() !== articleId) return;
          this.selectedArticle.set(article);
          this.treeArticleUpdate.set(article);
          this.draftTitle = article.title;
          this.draftContent = article.content;
          const currentBreadcrumbs = this.breadcrumbs();
          if (currentBreadcrumbs.length) {
            this.breadcrumbs.set([...currentBreadcrumbs.slice(0, -1), article.title]);
          }
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
  createdArticle = signal<Article | null>(null);
  selectedArticleId = signal<number | null>(null);
  treeArticleUpdate = signal<Article | null>(null);
  deletedArticleId = signal<number | null>(null);
  breadcrumbs = signal<string[]>([]);
  draftTitle = '';
  draftContent = '';
  isLoadingArticle = signal(false);
  articleLoadError = signal<string | null>(null);
  private articleRequestSequence = 0;

  selectArticle(selection: { id: number; breadcrumbs: string[] }) {
    this.breadcrumbs.set(selection.breadcrumbs);
    this.router.navigate(['/home', selection.id]);
  }

  private loadArticle(articleId: number) {
    const requestSequence = ++this.articleRequestSequence;
    this.selectedArticleId.set(articleId);
    this.selectedArticle.set(null);
    this.draftTitle = '';
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
        this.draftTitle = article.title;
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

  createArticle(parentId: number | null, parentBreadcrumbs: string[] = []) {
    this.articleService.createArticle({
      title: 'Новая статья',
      content: '',
      parentId,
    }).subscribe({
      next: (article) => {
        this.treeArticleUpdate.set(article);
        this.selectedArticleId.set(article.id);
        this.selectedArticle.set(article);
        this.draftTitle = article.title;
        this.draftContent = article.content;
        this.breadcrumbs.set([...parentBreadcrumbs, article.title]);
        this.articleLoadError.set(null);
        this.isLoadingArticle.set(false);
        this.editorState = 'write';
        this.router.navigate(['/home', article.id]);
      },
      error: (error) => {
        console.error('Не удалось создать статью:', error);
        this.articleLoadError.set('Не удалось создать статью. Проверьте соединение и попробуйте ещё раз.');
      },
    });
  }

  updateDraft(content: string) {
    this.draftContent = content;
  }

  updateTitle(title: string) {
    this.draftTitle = title;
  }

  deleteSelectedArticle() {
    const article = this.selectedArticle();
    if (!article || !window.confirm(`Удалить статью «${article.title}» и все вложенные статьи?`)) return;

    const articleId = article.id;
    this.articleService.deleteArticle(articleId).subscribe({
      next: () => {
        this.deletedArticleId.set(articleId);
        this.articleRequestSequence++;
        this.selectedArticleId.set(null);
        this.selectedArticle.set(null);
        this.breadcrumbs.set([]);
        this.draftTitle = '';
        this.draftContent = '';
        this.articleLoadError.set(null);
        this.isLoadingArticle.set(false);
        this.editorState = 'read';
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('Не удалось удалить статью:', error);
        window.alert('Не удалось удалить статью. Проверьте соединение и попробуйте ещё раз.');
      },
    });
  }
}
