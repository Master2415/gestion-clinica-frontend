import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../servicios/token';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = 'Usuario';
  mobileMenuOpen: boolean = false;

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.tokenService.isLogged();

    if (this.isAuthenticated) {
      // Obtener el nombre del usuario del token
      this.userName = this.tokenService.getNombre() || 'Usuario';
    } else {
      this.userName = '';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.tokenService.logout();
    this.isAuthenticated = false;
    this.userName = '';
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.mobileMenuOpen = false; // Close mobile menu after navigation
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
