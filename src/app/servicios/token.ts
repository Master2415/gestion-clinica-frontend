import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = "AuthToken";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router) { }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLogged(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  // Decode JWT token
  private decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRol(): string {
    const decoded = this.decodeToken();
    return decoded?.rol || '';
  }

  getCodigo(): number {
    const decoded = this.decodeToken();
    return decoded?.id || 0;
  }

  getNombre(): string {
    const decoded = this.decodeToken();
    return decoded?.sub || '';
  }
}