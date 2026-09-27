import { Component, computed, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { ArticleService } from '@core/services/article';
import { Article } from '@core/models/article.model';
import { Button } from '@components/button/button';

interface TreeArticle {
  article: Article;
  depth: number;
  hasChildren: boolean;
}


@Component({
  selector: 'app-nav-tree',
  imports: [Button],
  templateUrl: './nav-tree.html',
  styleUrl: './nav-tree.less',
})
export class NavTree implements OnChanges {

  private articleService = inject(ArticleService);

  @Input() activeArticleId: number | null = null;
  @Input() set articleUpdate(article: Article | null) {
    if (!article) return;
    this.articles.update((articles) => {
      const existingIndex = articles.findIndex((item) => item.id === article.id);
      if (existingIndex === -1) return [...articles, article];
      return articles.map((item) => item.id === article.id ? article : item);
    });
  }
  @Input() set deletedArticleId(articleId: number | null) {
    if (articleId === null) return;

    const articlesById = new Map(this.articles().map((article) => [article.id, article]));
    const deletedIds = new Set<number>([articleId]);
    let foundDescendant = true;

    while (foundDescendant) {
      foundDescendant = false;
      for (const article of articlesById.values()) {
        if (article.parentId !== null && deletedIds.has(article.parentId) && !deletedIds.has(article.id)) {
          deletedIds.add(article.id);
          foundDescendant = true;
        }
      }
    }

    this.articles.update((articles) => articles.filter((article) => !deletedIds.has(article.id)));
  }

  articles = signal<Article[]>([]);
  collapsedArticleIds = signal<Set<number>>(new Set());
  treeArticles = computed(() => {
    const collapsedArticleIds = this.collapsedArticleIds();
    const childrenByParent = new Map<number | null, Article[]>();
    for (const article of this.articles()) {
      const children = childrenByParent.get(article.parentId) ?? [];
      children.push(article);
      childrenByParent.set(article.parentId, children);
    }

    const tree: TreeArticle[] = [];
    const visited = new Set<number>();
    const markDescendantsVisited = (parentId: number): void => {
      for (const article of childrenByParent.get(parentId) ?? []) {
        if (visited.has(article.id)) continue;
        visited.add(article.id);
        markDescendantsVisited(article.id);
      }
    };

    const addChildren = (parentId: number | null, depth: number): void => {
      for (const article of childrenByParent.get(parentId) ?? []) {
        if (visited.has(article.id)) continue;

        visited.add(article.id);
        const hasChildren = (childrenByParent.get(article.id)?.length ?? 0) > 0;
        tree.push({ article, depth, hasChildren });
        if (!collapsedArticleIds.has(article.id)) {
          addChildren(article.id, depth + 1);
        } else {
          markDescendantsVisited(article.id);
        }
      }
    };

    addChildren(null, 0);
    for (const article of this.articles()) {
      if (!visited.has(article.id)) {
        visited.add(article.id);
        const hasChildren = (childrenByParent.get(article.id)?.length ?? 0) > 0;
        tree.push({ article, depth: 0, hasChildren });
        if (!collapsedArticleIds.has(article.id)) {
          addChildren(article.id, 1);
        } else {
          markDescendantsVisited(article.id);
        }
      }
    }

    return tree;
  });


  ngOnInit() {
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.collapsedArticleIds.set(new Set(
          this.treeArticles()
            .filter((item) => item.depth > 0 && item.hasChildren)
            .map((item) => item.article.id),
        ));
        if (this.activeArticleId !== null) {
          this.breadcrumbsChanged.emit(this.getBreadcrumbs(this.activeArticleId));
        }
      },
      error: (error) => alert(error),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeArticleId'] && this.activeArticleId !== null && this.articles().length) {
      this.breadcrumbsChanged.emit(this.getBreadcrumbs(this.activeArticleId));
    }
  }

  @Output() articleSelected = new EventEmitter<{ id: Article['id']; breadcrumbs: string[] }>();
  @Output() breadcrumbsChanged = new EventEmitter<string[]>();

  @Output() createChildArticle = new EventEmitter<{ parentId: Article['id']; breadcrumbs: string[] }>();

  requestChildArticle(event: MouseEvent, parentId: number) {
    event.stopPropagation();
    this.createChildArticle.emit({ parentId, breadcrumbs: this.getBreadcrumbs(parentId) });
  }

  selectArticle(articleId: number) {
    this.articleSelected.emit({ id: articleId, breadcrumbs: this.getBreadcrumbs(articleId) });
  }

  formatTitle(title: string): string {
    return title.length > 33 ? `${title.slice(0, 33)}...` : title;
  }

  toggleBranch(event: MouseEvent, articleId: number) {
    event.stopPropagation();
    this.collapsedArticleIds.update((collapsed) => {
      const next = new Set(collapsed);
      if (next.has(articleId)) {
        next.delete(articleId);
      } else {
        next.add(articleId);
      }
      return next;
    });
  }

  private getBreadcrumbs(articleId: number): string[] {
    const articlesById = new Map(this.articles().map((article) => [article.id, article]));
    const breadcrumbs: string[] = [];
    const visited = new Set<number>();
    let article = articlesById.get(articleId);

    while (article && !visited.has(article.id)) {
      visited.add(article.id);
      breadcrumbs.unshift(article.title);
      article = article.parentId === null ? undefined : articlesById.get(article.parentId);
    }

    return breadcrumbs;
  }
}
