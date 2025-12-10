import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MedicoService } from '../../../servicios/medico.service';
import { TokenService } from '../../../servicios/token';
import { DetalleAtencionMedicaDTO } from '../../../modelo/detalle-atencion-medica-dto';

@Component({
    selector: 'app-historial-citas',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="page-container">
        <div class="page-header">
            <div class="header-content">
                <h2 class="page-title">Historial de Citas</h2>
                <p class="page-subtitle">Registro completo de atenciones realizadas</p>
            </div>
            <a routerLink="/medico/dashboard" class="btn-back">
                <i class="bi bi-arrow-left"></i> Volver
            </a>
        </div>

        <div class="loading-state" *ngIf="isLoading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando historial...</p>
        </div>

        <div *ngIf="!isLoading && citas.length === 0" class="empty-state">
            <div class="empty-icon">
                <i class="bi bi-journal-x"></i>
            </div>
            <h3>No hay citas en el historial</h3>
            <p>Aún no ha realizado ninguna atención médica.</p>
        </div>

        <div *ngIf="!isLoading && citas.length > 0" class="table-container">
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Paciente</th>
                            <th>Diagnóstico</th>
                            <th>Tratamiento</th>
                            <th>Notas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let cita of citas">
                            <td>
                                <div class="date-wrapper">
                                    <i class="bi bi-calendar-event"></i>
                                    <span>{{ cita.fechaAtencion | date:'mediumDate' }}</span>
                                </div>
                                <small class="text-muted">{{ cita.fechaAtencion | date:'shortTime' }}</small>
                            </td>
                            <td>
                                <div class="patient-wrapper">
                                    <div class="avatar-xs">
                                        <i class="bi bi-person-fill"></i>
                                    </div>
                                    <span class="patient-name">{{ cita.nombrePaciente }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="text-truncate-2">{{ cita.diagnostico }}</div>
                            </td>
                            <td>
                                <div class="text-truncate-2">{{ cita.tratamiento }}</div>
                            </td>
                            <td>
                                <div class="text-truncate-2 text-muted">{{ cita.notasMedicas || 'Sin notas adicionales' }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease-out; }
    
    /* Header */
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0; }
    .page-subtitle { color: var(--text-secondary); font-size: 1rem; margin: 0; }
    
    .btn-back { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: white; color: var(--text-secondary); border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; font-weight: 500; text-decoration: none; transition: all 0.2s; box-shadow: var(--shadow-sm); }
    .btn-back:hover { background: var(--neutral-light); color: var(--text-primary); transform: translateX(-2px); }

    /* Table Styling */
    .table-container { background: white; border-radius: 16px; box-shadow: var(--shadow-sm); overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
    .table-responsive { overflow-x: auto; }
    
    .custom-table { width: 100%; border-collapse: collapse; }
    .custom-table th { background: #f8fafc; padding: 1rem 1.5rem; text-align: left; font-weight: 600; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
    .custom-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; color: var(--text-primary); vertical-align: top; }
    .custom-table tr:last-child td { border-bottom: none; }
    .custom-table tr:hover { background: #f8fafc; }

    /* Cell Content */
    .date-wrapper { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; color: var(--text-primary); margin-bottom: 0.25rem; }
    .date-wrapper i { color: var(--primary-cyan); }
    
    .patient-wrapper { display: flex; align-items: center; gap: 0.75rem; }
    .avatar-xs { width: 32px; height: 32px; background: var(--neutral-light); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 1rem; flex-shrink: 0; }
    .patient-name { font-weight: 600; color: var(--text-primary); }
    
    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 250px; line-height: 1.5; font-size: 0.95rem; }
    .text-muted { color: var(--text-secondary); font-size: 0.85rem; }

    /* Empty State */
    .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 16px; box-shadow: var(--shadow-sm); border: 1px dashed rgba(0,0,0,0.1); }
    .empty-icon { width: 80px; height: 80px; background: var(--neutral-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: var(--text-secondary); font-size: 2.5rem; }
    .empty-state h3 { color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 600; }
    .empty-state p { color: var(--text-secondary); margin: 0; }

    /* Loading State */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; color: var(--text-secondary); gap: 1rem; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    @media (max-width: 768px) {
        .page-header { flex-direction: column; align-items: flex-start; }
        .btn-back { width: 100%; justify-content: center; }
        .text-truncate-2 { max-width: 150px; }
    }
  `]
})
export class HistorialCitas implements OnInit {
    citas: DetalleAtencionMedicaDTO[] = [];
    isLoading = true;
    codigoMedico = 0;

    constructor(
        private medicoService: MedicoService,
        private tokenService: TokenService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.codigoMedico = this.tokenService.getCodigo();
        this.loadHistorial();
    }

    loadHistorial(): void {
        this.isLoading = true;
        this.medicoService.listarCitasRealizadas(this.codigoMedico).subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.citas = response.respuesta;
                }
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (error) => {
                console.error('Error loading history', error);
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }
}
