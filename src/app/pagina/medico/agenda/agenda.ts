import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedicoService } from '../../../servicios/medico.service';
import { TokenService } from '../../../servicios/token';
import { DiaLibreDTO } from '../../../modelo/dia-libre-dto';

@Component({
    selector: 'app-agenda',
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="page-container">
        <div class="page-header">
            <div class="header-content">
                <h2 class="page-title">Gestionar Agenda</h2>
                <p class="page-subtitle">Configure su disponibilidad y días libres</p>
            </div>
            <a routerLink="/medico/dashboard" class="btn-back">
                <i class="bi bi-arrow-left"></i> Volver
            </a>
        </div>

        <div class="content-grid">
            <div class="info-card">
                <div class="info-icon">
                    <i class="bi bi-calendar-x"></i>
                </div>
                <div class="info-text">
                    <h3>Marcar Día Libre</h3>
                    <p>Seleccione una fecha y motivo para marcar un día como no disponible en su agenda. Los pacientes no podrán agendar citas en este día.</p>
                </div>
            </div>

            <div class="form-card">
                <div class="card-header">
                    <i class="bi bi-calendar-plus"></i>
                    <h3>Nuevo Día Libre</h3>
                </div>

                <form (ngSubmit)="marcarDiaLibre()" class="agenda-form">
                    <div class="form-group">
                        <label class="form-label">
                            <i class="bi bi-calendar-date"></i> Fecha *
                        </label>
                        <div class="input-wrapper">
                            <input type="date" [(ngModel)]="diaLibre.fecha" name="fecha" required class="form-control">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <i class="bi bi-chat-square-text"></i> Motivo *
                        </label>
                        <div class="input-wrapper">
                            <textarea [(ngModel)]="diaLibre.motivo" name="motivo" required rows="3"
                                class="form-control" placeholder="Indique el motivo del día libre..."></textarea>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" [disabled]="isLoading" class="btn-submit">
                            <span *ngIf="!isLoading">
                                <i class="bi bi-check-lg"></i> Confirmar Día Libre
                            </span>
                            <div *ngIf="isLoading" class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Guardando...</span>
                            </div>
                        </button>
                    </div>

                    <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center mt-3" role="alert">
                        <i class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"></i>
                        <div>{{ errorMessage }}</div>
                    </div>
                    
                    <div *ngIf="successMessage" class="alert alert-success d-flex align-items-center mt-3" role="alert">
                        <i class="bi bi-check-circle-fill flex-shrink-0 me-2"></i>
                        <div>{{ successMessage }}</div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .page-container { max-width: 900px; margin: 0 auto; animation: fadeIn 0.4s ease-out; }
    
    /* Header */
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0; }
    .page-subtitle { color: var(--text-secondary); font-size: 1rem; margin: 0; }
    
    .btn-back { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: white; color: var(--text-secondary); border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; font-weight: 500; text-decoration: none; transition: all 0.2s; box-shadow: var(--shadow-sm); }
    .btn-back:hover { background: var(--neutral-light); color: var(--text-primary); transform: translateX(-2px); }

    /* Content Grid */
    .content-grid { display: grid; gap: 2rem; }

    /* Info Card */
    .info-card { background: linear-gradient(135deg, var(--primary-cyan) 0%, var(--primary-blue) 100%); color: white; padding: 2rem; border-radius: 16px; display: flex; align-items: flex-start; gap: 1.5rem; box-shadow: var(--shadow-md); }
    .info-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
    .info-text h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600; }
    .info-text p { margin: 0; opacity: 0.9; line-height: 1.5; }

    /* Form Card */
    .form-card { background: white; border-radius: 16px; box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); overflow: hidden; }
    .card-header { padding: 1.5rem; background: linear-gradient(to right, #f8fafc, #ffffff); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 0.75rem; color: var(--text-primary); font-size: 1.25rem; font-weight: 600; }
    .card-header i { color: var(--primary-cyan); }
    
    .agenda-form { padding: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    
    .form-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.5rem; }
    .form-label i { color: var(--primary-cyan); }
    
    .form-control { width: 100%; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; transition: all 0.2s; background: #f8fafc; }
    .form-control:focus { outline: none; border-color: var(--primary-cyan); background: white; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
    
    .form-actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
    
    .btn-submit { padding: 0.875rem 2rem; background: linear-gradient(135deg, var(--primary-cyan) 0%, var(--primary-blue) 100%); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2); }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    @media (max-width: 768px) {
        .page-header { flex-direction: column; align-items: flex-start; }
        .btn-back { width: 100%; justify-content: center; }
        .info-card { flex-direction: column; text-align: center; align-items: center; }
        .btn-submit { width: 100%; justify-content: center; }
    }
  `]
})
export class Agenda implements OnInit {
    diaLibre: DiaLibreDTO = new DiaLibreDTO();
    isLoading = false;
    errorMessage = '';
    successMessage = '';
    codigoMedico = 0;

    constructor(
        private medicoService: MedicoService,
        private tokenService: TokenService
    ) { }

    ngOnInit(): void {
        this.codigoMedico = this.tokenService.getCodigo();
        this.diaLibre.codigoMedico = this.codigoMedico;
    }

    marcarDiaLibre(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.medicoService.agendarDiaLibre(this.diaLibre).subscribe({
            next: (response) => {
                this.successMessage = 'Día libre marcado exitosamente';
                this.isLoading = false;
                // Reset form
                this.diaLibre = new DiaLibreDTO();
                this.diaLibre.codigoMedico = this.codigoMedico;
            },
            error: (error) => {
                this.errorMessage = error.error?.respuesta || 'Error al marcar día libre';
                this.isLoading = false;
            }
        });
    }
}
