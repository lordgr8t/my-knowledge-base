import { Component, computed, inject, signal } from '@angular/core';
import { ArticleService } from '@core/services/article';
import { Article } from '@core/models/article.model';

interface TreeArticle {
  article: Article;
  depth: number;
}


@Component({
  selector: 'app-nav-tree',
  imports: [],
  templateUrl: './nav-tree.html',
  styleUrl: './nav-tree.less',
})
export class NavTree {

  private articleService = inject(ArticleService);

  articles = signal<Article[]>([]);
  treeArticles = computed(() => {
    const childrenByParent = new Map<number | null, Article[]>();
    for (const article of this.articles()) {
      const children = childrenByParent.get(article.parentId) ?? [];
      children.push(article);
      childrenByParent.set(article.parentId, children);
    }

    const tree: TreeArticle[] = [];
    const visited = new Set<number>();
    const addChildren = (parentId: number | null, depth: number): void => {
      for (const article of childrenByParent.get(parentId) ?? []) {
        if (visited.has(article.id)) continue;

        visited.add(article.id);
        tree.push({ article, depth });
        addChildren(article.id, depth + 1);
      }
    };

    addChildren(null, 0);
    for (const article of this.articles()) {
      if (!visited.has(article.id)) {
        visited.add(article.id);
        tree.push({ article, depth: 0 });
        addChildren(article.id, 1);
      }
    }

    return tree;
  });


  ngOnInit() {
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles);
      },
      error: (error) => alert(error),
    });
  }
}
