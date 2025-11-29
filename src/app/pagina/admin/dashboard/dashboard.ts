import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { TokenService } from '../../../servicios/token';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalMedicos = 0;
  totalPqrs = 0;
  totalCitas = 0;
  isLoading = true;
  userName = '';

  constructor(
    private adminService: AdministradorService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userName = this.tokenService.getNombre();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.adminService.listarMedicos().subscribe({
      next: (response) => {
        console.log('Respuesta listarMedicos:', response);
        if (response.respuesta) {
          this.totalMedicos = response.respuesta.length;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error listarMedicos:', err);
      },
    });

    this.adminService.listarPQRS().subscribe({
      next: (response) => {
        console.log('Respuesta listarPQRS:', response);
        if (response.respuesta) {
          this.totalPqrs = response.respuesta.length;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error listarPQRS:', err);
      },
    });

    this.adminService.listarCitas().subscribe({
      next: (response) => {
        console.log('Respuesta listarCitas:', response);
        if (response.respuesta) {
          this.totalCitas = response.respuesta.length;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error listarCitas:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }
}
