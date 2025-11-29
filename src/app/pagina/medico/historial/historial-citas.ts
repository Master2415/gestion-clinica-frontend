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
    <div class="historial-page">
        <div class="page-header">
            <h2>Historial de Citas</h2>
            <a routerLink="/medico/dashboard" class="btn-secondary">← Volver</a>
        </div>

        <div *ngIf="isLoading" class="loading">Cargando historial...</div>

        <div *ngIf="!isLoading && citas.length === 0" class="empty-state">
            <div class="empty-icon">📚</div>
            <p>No hay citas en el historial</p>
        </div>

        <div *ngIf="!isLoading && citas.length > 0" class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Paciente</th>
                        <th>Diagnóstico</th>
                        <th>Tratamiento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let cita of citas">
                        <td>{{ cita.fechaAtencion | date:'short' }}</td>
                        <td>{{ cita.nombrePaciente }}</td>
                        <td>{{ cita.diagnostico }}</td>
                        <td>{{ cita.tratamiento }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  `,
    styles: [`
    .historial-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h2 { margin: 0; color: #2c3e50; font-size: 2rem; }
    .btn-secondary { padding: 0.75rem 1.5rem; background: #95a5a6; color: white; text-decoration: none; border-radius: 6px; transition: all 0.3s; }
    .btn-secondary:hover { background: #7f8c8d; }
    .loading { text-align: center; padding: 3rem; color: #7f8c8d; font-size: 1.2rem; }
    .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .empty-icon { font-size: 5rem; margin-bottom: 1rem; opacity: 0.5; }
    .table-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; }
    tr:hover { background: #f8f9fa; }
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
