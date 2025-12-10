import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  expandedCitaId: number | null = null;
  showCancelModal = false;
  citaToCancel: CitaPacienteDTO | null = null;

  constructor(
    private pacienteService: PacienteService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef
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
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  toggleDetalle(codigoCita: number): void {
    if (this.expandedCitaId === codigoCita) {
      this.expandedCitaId = null;
    } else {
      this.expandedCitaId = codigoCita;
    }
  }

  isExpanded(codigoCita: number): boolean {
    return this.expandedCitaId === codigoCita;
  }

  abrirModalCancelacion(cita: CitaPacienteDTO): void {
    this.citaToCancel = cita;
    this.showCancelModal = true;
  }

  cerrarModal(): void {
    this.showCancelModal = false;
    this.citaToCancel = null;
  }

  confirmarCancelacion(): void {
    if (this.citaToCancel) {
      this.pacienteService.cancelarCita(this.citaToCancel.codigo, this.codigoPaciente).subscribe({
        next: (response) => {
          alert(response.respuesta || 'Cita cancelada exitosamente');
          this.cerrarModal();
          this.loadCitas();
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          alert('Error al cancelar la cita: ' + (error.error?.respuesta || 'Error desconocido'));
          this.cerrarModal();
        }
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
