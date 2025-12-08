import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../servicios/token';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = 'Usuario';

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
  }
}
