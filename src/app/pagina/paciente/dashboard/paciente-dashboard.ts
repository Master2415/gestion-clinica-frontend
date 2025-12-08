import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PacienteService } from '../../../servicios/paciente.service';
import { TokenService } from '../../../servicios/token';

@Component({
  selector: 'app-paciente-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-dashboard.html',
  styleUrls: ['./paciente-dashboard.css']
})
export class PacienteDashboard implements OnInit {
  totalCitas = 0;
  citasPendientes = 0;
  registrosMedicos = 0;
  isLoading = true;
  codigoPaciente = 0;
  userName = '';

  constructor(
    private pacienteService: PacienteService,
    private tokenService: TokenService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.codigoPaciente = this.tokenService.getCodigo();
    this.userName = this.tokenService.getNombre();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;

    // Load appointments
    this.pacienteService.listarCitasPaciente(this.codigoPaciente).subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.totalCitas = response.respuesta.length;
          this.citasPendientes = response.respuesta.filter(
            c => c.estadoCita?.estado?.toLowerCase() === 'pendiente'
          ).length;
        }
        this.cd.detectChanges();
      },
      error: (error) => console.error('Error loading appointments:', error)
    });

    // Load medical history
    this.pacienteService.listarHistorialMedico(this.codigoPaciente).subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.registrosMedicos = response.respuesta.length;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading medical history:', error);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/paciente/${route}`]);
  }
}
