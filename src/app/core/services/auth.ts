import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@core/models/auth.model';


@Injectable({
  providedIn: 'root',
})



export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, request).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, request).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

