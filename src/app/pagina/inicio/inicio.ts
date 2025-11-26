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

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.tokenService.isLogged();

    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    } else {
      // Aquí podrías decodificar el token JWT para obtener el nombre del usuario
      // Por ahora usamos un nombre genérico
      this.userName = 'Paciente';
    }
  }

  logout(): void {
    this.tokenService.logout();
  }
}

