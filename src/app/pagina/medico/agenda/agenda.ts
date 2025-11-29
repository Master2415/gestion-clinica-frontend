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
    <div class="agenda-page">
        <div class="page-header">
            <h2>Gestionar Agenda</h2>
            <a routerLink="/medico/dashboard" class="btn-secondary">← Volver</a>
        </div>

        <div class="agenda-content">
            <div class="info-card">
                <h3>Marcar Día Libre</h3>
                <p>Seleccione una fecha y motivo para marcar un día como no disponible</p>
            </div>

            <form (ngSubmit)="marcarDiaLibre()" class="dia-libre-form">
                <div class="form-group">
                    <label>Fecha *</label>
                    <input type="date" [(ngModel)]="diaLibre.fecha" name="fecha" required>
                </div>

                <div class="form-group">
                    <label>Motivo *</label>
                    <textarea [(ngModel)]="diaLibre.motivo" name="motivo" required rows="3"
                        placeholder="Indique el motivo del día libre..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" [disabled]="isLoading" class="btn-primary">
                        {{ isLoading ? 'Guardando...' : 'Marcar Día Libre' }}
                    </button>
                </div>

                <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
                <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
            </form>
        </div>
    </div>
  `,
    styles: [`
    .agenda-page { max-width: 800px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h2 { margin: 0; color: #2c3e50; font-size: 2rem; }
    .btn-secondary { padding: 0.75rem 1.5rem; background: #95a5a6; color: white; text-decoration: none; border-radius: 6px; transition: all 0.3s; }
    .btn-secondary:hover { background: #7f8c8d; }
    .agenda-content { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .info-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; }
    .info-card h3 { margin: 0 0 0.5rem 0; }
    .info-card p { margin: 0; opacity: 0.9; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50; }
    input, textarea { width: 100%; padding: 0.75rem; border: 2px solid #ecf0f1; border-radius: 6px; font-size: 1rem; font-family: inherit; transition: border-color 0.3s; }
    input:focus, textarea:focus { outline: none; border-color: #667eea; }
    textarea { resize: vertical; }
    .form-actions { margin-top: 2rem; }
    .btn-primary { padding: 0.75rem 2rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 600; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(102,126,234,0.4); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert { padding: 1rem; margin-top: 1rem; border-radius: 6px; font-weight: 500; }
    .alert-error { background: #fee; color: #c33; }
    .alert-success { background: #efe; color: #3c3; }
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
