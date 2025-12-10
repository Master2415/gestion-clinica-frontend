import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorService } from '../../../servicios/administrador.service';
import { CitaDTOAdmin } from '../../../modelo/cita-dto-admin';

@Component({
  selector: 'app-listar-citas',
  imports: [CommonModule],
  template: `
    <div class="citas-page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Citas Programadas</h2>
          <p class="text-muted">Visualiza todas las citas médicas agendadas en el sistema</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando calendario de citas...</p>
      </div>

      <div *ngIf="!isLoading && citas.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-calendar-x"></i>
        </div>
        <h3>No hay citas programadas</h3>
        <p>Actualmente no hay citas registradas en el sistema.</p>
      </div>

      <div *ngIf="!isLoading && citas.length > 0" class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cita of citas">
              <td>
                <span class="badge-code">#{{ cita.codigoCita }}</span>
              </td>
              <td class="fw-bold text-primary">{{ cita.nombrePaciente }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-person-badge text-muted"></i>
                  {{ cita.nombreMedico }}
                </div>
              </td>
              <td>{{ cita.fecha | date : 'mediumDate' }}</td>
              <td>
                <span class="time-badge">
                  <i class="bi bi-clock"></i> {{ cita.fecha | date : 'shortTime' }}
                </span>
              </td>
              <td>{{ cita.motivo }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-danger" 
                  *ngIf="cita.estadoCita === 'PROGRAMADA' || cita.estadoCita === 'PENDIENTE'"
                  (click)="cancelarCita(cita.codigoCita)"
                  title="Cancelar Cita">
                  <i class="bi bi-x-circle"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .citas-page {
        padding: 0;
      }
      .page-header {
        margin-bottom: 2rem;
      }
      .page-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
      }
      .loading-state {
        text-align: center;
        padding: 4rem;
        color: var(--text-muted);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: var(--shadow-sm);
      }
      .empty-icon {
        font-size: 4rem;
        color: var(--neutral-medium);
        margin-bottom: 1rem;
        opacity: 0.5;
      }
      .table-container {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
      .custom-table {
        width: 100%;
        border-collapse: collapse;
      }
      .custom-table th {
        background: var(--neutral-light);
        padding: 1.25rem 1.5rem;
        text-align: left;
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .custom-table td {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--neutral-light);
        color: var(--text-secondary);
        vertical-align: middle;
      }
      .custom-table tr:last-child td {
        border-bottom: none;
      }
      .custom-table tr:hover td {
        background: #f8fafc;
      }
      .badge-code {
        background: var(--neutral-light);
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-family: monospace;
        font-weight: 600;
        color: var(--text-primary);
      }
      .time-badge {
        background: #eff6ff;
        color: var(--primary-blue);
        padding: 0.35rem 0.75rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
    `,
  ],
})
export class ListarCitas implements OnInit {
  citas: CitaDTOAdmin[] = [];
  isLoading = true;

  constructor(private adminService: AdministradorService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.adminService.listarCitas().subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.citas = response.respuesta;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }
  cancelarCita(codigoCita: number): void {
    if (
      confirm('¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.')
    ) {
      this.adminService.cambiarEstadoCita(codigoCita, 4).subscribe({
        // 4 is CANCELADA
        next: (response) => {
          alert(response.respuesta || 'Cita cancelada exitosamente');
          this.ngOnInit(); // Reload list
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          alert('Error al cancelar la cita: ' + (error.error?.respuesta || 'Error desconocido'));
        },
      });
    }
  }
}
