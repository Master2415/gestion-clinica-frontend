import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../servicios/paciente.service';
import { TokenService } from '../../../servicios/token';
import { CitaPacienteDTO } from '../../../modelo/cita-paciente-dto';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.css']
})
export class MisCitas implements OnInit {
  citas: CitaPacienteDTO[] = [];
  isLoading = true;
  codigoPaciente = 0;

  constructor(
    private pacienteService: PacienteService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.codigoPaciente = this.tokenService.getCodigo();
    this.loadCitas();
  }

  loadCitas(): void {
    this.isLoading = true;
    this.pacienteService.listarCitasPaciente(this.codigoPaciente).subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.citas = response.respuesta;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoading = false;
      }
    });
  }

  cancelarCita(codigoCita: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      this.pacienteService.cancelarCita(codigoCita).subscribe({
        next: () => {
          this.loadCitas();
        },
        error: (error) => console.error('Error cancelling appointment:', error)
      });
    }
  }

  getStatusClass(estadoCita: any): string {
    const estado = estadoCita?.estado?.toLowerCase() || '';
    switch (estado) {
      case 'pendiente': return 'status-pending';
      case 'completada': return 'status-completed';
      case 'cancelada': return 'status-cancelled';
      default: return '';
    }
  }
}
