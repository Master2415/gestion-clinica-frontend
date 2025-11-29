import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { InfoPQRSDTO } from '../../../modelo/info-pqrs-dto';
import { RespuestaAdminDTO } from '../../../modelo/respuesta-admin-dto';
import { TokenService } from '../../../servicios/token';

@Component({
  selector: 'app-detalle-pqrs',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="detalle-page" *ngIf="pqrs">
      <div class="page-header">
        <h2>Detalle PQRS #{{ pqrs.codigo }}</h2>
        <a routerLink="/admin/pqrs" class="btn-secondary">Volver</a>
      </div>

      <div class="card">
        <div class="card-header">
          <span
            class="badge"
            [class.badge-nuevo]="pqrs.estado.estado === 'NUEVO'"
            [class.badge-proceso]="pqrs.estado.estado === 'EN_PROCESO'"
            [class.badge-resuelto]="pqrs.estado.estado === 'RESUELTO'"
          >
            {{ pqrs.estado.estado }}
          </span>
          <span class="date">{{ pqrs.fecha | date : 'medium' }}</span>
        </div>

        <div class="card-body">
          <div class="info-group">
            <label>Paciente:</label>
            <p>{{ pqrs.nombrePaciente }}</p>
          </div>

          <div class="info-group">
            <label>Médico:</label>
            <p>{{ pqrs.nombreMedico }} ({{ pqrs.especializacion.nombre }})</p>
          </div>

          <div class="info-group">
            <label>Motivo:</label>
            <p>{{ pqrs.motivo }}</p>
          </div>
        </div>
      </div>

      <div class="messages-section">
        <h3>Historial de Mensajes</h3>
        <div class="messages-container">
          <div
            class="message"
            *ngFor="let msg of pqrs.mensajes"
            [class.message-admin]="isAdminMessage(msg.codigoCuenta)"
          >
            <div class="message-header">
              <span class="author">
                {{ isAdminMessage(msg.codigoCuenta) ? 'Administrador' : 'Usuario' }}
                (ID: {{ msg.codigoCuenta }})
              </span>
              <span class="date">{{ msg.fechaCreacion | date : 'short' }}</span>
            </div>
            <div class="message-body">
              {{ msg.mensaje }}
            </div>
          </div>

          <div *ngIf="pqrs.mensajes.length === 0" class="no-messages">No hay mensajes aún</div>
        </div>

        <div class="response-form">
          <h4>Responder al Paciente</h4>
          <textarea
            [(ngModel)]="nuevoMensaje"
            placeholder="Escriba su respuesta aquí..."
            rows="4"
            [disabled]="isSubmitting"
          ></textarea>

          <div class="form-actions">
            <button
              (click)="enviarRespuesta()"
              [disabled]="!nuevoMensaje.trim() || isSubmitting"
              class="btn-primary"
            >
              {{ isSubmitting ? 'Enviando...' : 'Enviar Respuesta' }}
            </button>
          </div>

          <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
    <div *ngIf="!pqrs && !isLoading" class="error-state">
      No se encontró la información del PQRS
    </div>
    <div *ngIf="isLoading" class="loading">Cargando información...</div>
  `,
  styles: [
    `
      .detalle-page {
        padding: 2rem;
        max-width: 900px;
        margin: 0 auto;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .btn-secondary {
        padding: 0.5rem 1rem;
        background: #95a5a6;
        color: white;
        text-decoration: none;
        border-radius: 4px;
      }
      .btn-secondary:hover {
        background: #7f8c8d;
      }
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-bottom: 2rem;
      }
      .card-header {
        padding: 1.5rem;
        background: #f8f9fa;
        border-bottom: 1px solid #ecf0f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .card-body {
        padding: 2rem;
      }
      .info-group {
        margin-bottom: 1.5rem;
      }
      .info-group label {
        display: block;
        font-weight: 600;
        color: #7f8c8d;
        margin-bottom: 0.5rem;
      }
      .info-group p {
        font-size: 1.1rem;
        color: #2c3e50;
        margin: 0;
      }
      .badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .badge-nuevo {
        background: #fff3cd;
        color: #856404;
      }
      .badge-proceso {
        background: #cfe2ff;
        color: #084298;
      }
      .badge-resuelto {
        background: #d1e7dd;
        color: #0f5132;
      }
      .loading,
      .error-state {
        text-align: center;
        padding: 3rem;
        color: #7f8c8d;
      }
      .messages-section {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .messages-section h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #2c3e50;
      }
      .messages-container {
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
      }
      .message {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-left: 3px solid #3498db;
      }
      .message-admin {
        border-left-color: #e74c3c;
        background: #fff5f5;
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }
      .author {
        font-weight: 600;
        color: #2c3e50;
        font-size: 0.9rem;
      }
      .date {
        color: #7f8c8d;
        font-size: 0.85rem;
      }
      .message-body {
        color: #34495e;
        line-height: 1.5;
      }
      .no-messages {
        text-align: center;
        padding: 2rem;
        color: #7f8c8d;
        font-style: italic;
      }
      .response-form {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #ecf0f1;
      }
      .response-form h4 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #2c3e50;
      }
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        font-family: inherit;
        resize: vertical;
      }
      textarea:focus {
        outline: none;
        border-color: #3498db;
      }
      textarea:disabled {
        background: #f8f9fa;
        cursor: not-allowed;
      }
      .form-actions {
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .btn-primary {
        padding: 0.75rem 1.5rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }
      .btn-primary:hover:not(:disabled) {
        background: #2980b9;
      }
      .btn-primary:disabled {
        background: #95a5a6;
        cursor: not-allowed;
      }
      .alert {
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 6px;
      }
      .alert-error {
        background: #fee;
        color: #c33;
        border: 1px solid #fcc;
      }
      .alert-success {
        background: #efe;
        color: #3c3;
        border: 1px solid #cfc;
      }
    `,
  ],
})
export class DetallePqrs implements OnInit {
  pqrs: InfoPQRSDTO | null = null;
  isLoading = true;
  isSubmitting = false;
  nuevoMensaje = '';
  successMessage = '';
  errorMessage = '';
  codigoCuenta = 0;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdministradorService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const codigo = this.route.snapshot.params['codigo'];
    if (codigo) {
      this.loadPqrs(codigo);
    }

    // Get admin account code from token
    this.codigoCuenta = this.tokenService.getCodigo();
  }

  loadPqrs(codigo: number): void {
    this.adminService.verDetallePQRS(codigo).subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.pqrs = response.respuesta;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando PQRS', error);
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  enviarRespuesta(): void {
    if (!this.pqrs || !this.nuevoMensaje.trim()) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const respuesta: RespuestaAdminDTO = {
      codigoPQRS: this.pqrs.codigo,
      codigoCuenta: this.codigoCuenta,
      mensaje: this.nuevoMensaje.trim(),
    };

    this.adminService.responderPQRS(respuesta).subscribe({
      next: (response) => {
        this.successMessage = 'Respuesta enviada exitosamente';
        this.nuevoMensaje = '';
        // Reload PQRS to show new message
        this.loadPqrs(this.pqrs!.codigo);
        this.isSubmitting = false;

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.respuesta || 'Error al enviar respuesta';
        this.isSubmitting = false;
      },
    });
  }

  isAdminMessage(codigoCuenta: number): boolean {
    // Simple check: if the message is from current admin account
    return codigoCuenta === this.codigoCuenta;
  }
}
