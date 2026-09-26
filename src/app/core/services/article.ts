import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Article, CreateArticleRequest, UpdateArticleRequest,ArticleTreeNode } from '@core/models/article.model';


@Injectable({
  providedIn: 'root',
})



export class ArticleService {

  constructor(private http: HttpClient) {};

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }


  private readonly articles = signal<Article[]>([]);

  getArticles(): Observable<Article[]> {
    const token = this.getAccessToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.get<Article[]>(`${environment.apiUrl}/api/articles`, { headers });
  }

}

