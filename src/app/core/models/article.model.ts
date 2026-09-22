export interface Article {
    id: number;
    title: string;
    content: string;
    parentId: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateArticleRequest {
    title: string;
    content: string;
    parentId: number | null;
}

export interface UpdateArticleRequest {
    title?: string;
    content?: string;
    parentId?: number | null;
}

export interface ArticleTreeNode extends Article {
  children: ArticleTreeNode[];
}