import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TokenService } from '../../../servicios/token';

@Component({
  selector: 'app-paciente-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-layout.html',
  styleUrls: ['./paciente-layout.css']
})
export class PacienteLayout implements OnInit {
  sidebarCollapsed = false;
  nombrePaciente = '';

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombrePaciente = this.tokenService.getNombre() || 'Paciente';
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/login']);
  }
}
