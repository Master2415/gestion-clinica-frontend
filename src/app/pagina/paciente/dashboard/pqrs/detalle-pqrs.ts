import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PacienteService } from '../../../../servicios/paciente.service';
import { TokenService } from '../../../../servicios/token';
import { InfoPQRSDTO } from '../../../../modelo/info-pqrs-dto';
import { RespuestaPacientePqrsDTO } from '../../../../modelo/respuesta-paciente-pqrs-dto';

@Component({
  selector: 'app-detalle-pqrs-paciente',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="detalle-page" *ngIf="pqrs">
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/paciente/mis-pqrs" class="back-link">
            <i class="bi bi-arrow-left"></i> Volver a mis PQRS
          </a>
          <h2 class="page-title">
            Detalle de Solicitud <span class="text-primary">#{{ pqrs.codigo }}</span>
          </h2>
        </div>
        <div class="header-actions">
          <span
            class="status-badge"
            [ngClass]="{
              'status-new': pqrs.estado.estado === 'NUEVO',
              'status-process': pqrs.estado.estado === 'EN_PROCESO',
              'status-resolved': pqrs.estado.estado === 'RESUELTO',
              'status-archived': pqrs.estado.estado === 'ARCHIVADO'
            }"
          >
            {{ pqrs.estado.estado }}
          </span>
        </div>
      </div>

      <div class="content-grid">
        <!-- Info Card -->
        <div class="info-card">
          <div class="card-header">
            <h3><i class="bi bi-info-circle-fill"></i> Información General</h3>
            <span class="date">{{ pqrs.fecha | date : 'medium' }}</span>
          </div>

          <div class="card-body">
            <div class="info-item">
              <label>Médico Relacionado</label>
              <p>
                {{ pqrs.nombreMedico }}
                <span class="text-muted">({{ pqrs.especializacion.nombre }})</span>
              </p>
            </div>

            <div class="info-item mt-3">
              <label>Motivo de la Solicitud</label>
              <p class="motivo-text">{{ pqrs.motivo }}</p>
            </div>
          </div>
        </div>

        <!-- Chat Section -->
        <div class="chat-section">
          <div class="chat-header">
            <h3><i class="bi bi-chat-dots-fill"></i> Historial de Conversación</h3>
          </div>

          <div class="messages-container">
            <div *ngIf="pqrs.mensajes.length === 0" class="empty-chat">
              <i class="bi bi-chat-square-text"></i>
              <p>No hay mensajes en esta conversación.</p>
            </div>

            <div
              class="message"
              *ngFor="let msg of pqrs.mensajes"
              [class.message-own]="isMyMessage(msg.codigoCuenta)"
              [class.message-admin]="!isMyMessage(msg.codigoCuenta)"
            >
              <div class="message-bubble">
                <div class="message-meta">
                  <span class="author">
                    {{ isMyMessage(msg.codigoCuenta) ? 'Yo' : 'Administrador' }}
                  </span>
                  <span class="time">{{ msg.fechaCreacion | date : 'shortTime' }}</span>
                </div>
                <div class="message-content">
                  {{ msg.mensaje }}
                </div>
                <div class="message-date">{{ msg.fechaCreacion | date : 'mediumDate' }}</div>
              </div>
            </div>
          </div>

          <div class="response-area" *ngIf="pqrs.estado.estado !== 'ARCHIVADO'">
            <div class="input-group">
              <textarea
                [(ngModel)]="nuevoMensaje"
                placeholder="Escribe una respuesta..."
                rows="3"
                [disabled]="isSubmitting"
              ></textarea>
              <button
                (click)="enviarRespuesta()"
                [disabled]="!nuevoMensaje.trim() || isSubmitting"
                class="btn-send"
              >
                <i class="bi bi-send-fill" *ngIf="!isSubmitting"></i>
                <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm"></span>
              </button>
            </div>

            <div *ngIf="successMessage" class="alert alert-success mt-2">
              <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
            </div>
            <div *ngIf="errorMessage" class="alert alert-danger mt-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
            </div>
          </div>

          <div *ngIf="pqrs.estado.estado === 'ARCHIVADO'" class="archived-notice">
            <i class="bi bi-archive-fill"></i>
            <p>Esta solicitud ha sido archivada y no se pueden enviar más mensajes.</p>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!pqrs && !isLoading" class="error-state">
      <i class="bi bi-search"></i>
      <h3>No encontrado</h3>
      <p>No se encontró la información del PQRS solicitado.</p>
      <a routerLink="/paciente/mis-pqrs" class="btn-secondary mt-3">Volver a mis PQRS</a>
    </div>

    <div *ngIf="isLoading" class="loading-state">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando detalles...</p>
    </div>
  `,
  styles: [
    `
      .detalle-page {
        max-width: 1200px;
        margin: 0 auto;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        margin-bottom: 0.5rem;
        transition: color 0.2s;
      }
      .back-link:hover {
        color: var(--primary-cyan);
      }
      .page-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }
      .text-primary {
        color: var(--primary-cyan);
      }
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 2rem;
      }
      @media (max-width: 992px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Info Card Styles */
      .info-card {
        background: white;
        border-radius: 16px;
        box-shadow: var(--shadow-md);
        overflow: hidden;
        height: fit-content;
      }
      .card-header {
        padding: 1.5rem;
        background: var(--neutral-light);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .card-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .date {
        font-size: 0.9rem;
        color: var(--text-secondary);
      }
      .card-body {
        padding: 1.5rem;
      }
      .info-item label {
        display: block;
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      .info-item p {
        margin: 0;
        color: var(--text-primary);
        font-size: 1rem;
      }
      .text-muted {
        color: var(--text-secondary);
      }
      .motivo-text {
        background: var(--neutral-light);
        padding: 1rem;
        border-radius: 8px;
        line-height: 1.5;
        color: var(--text-secondary);
      }
      .mt-3 {
        margin-top: 1rem;
      }

      /* Chat Styles */
      .chat-section {
        background: white;
        border-radius: 16px;
        box-shadow: var(--shadow-md);
        display: flex;
        flex-direction: column;
        height: 600px;
      }
      .chat-header {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .chat-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        background: #f1f5f9;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .empty-chat {
        text-align: center;
        color: var(--text-muted);
        margin-top: 4rem;
      }
      .empty-chat i {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
      }
      .message {
        display: flex;
        flex-direction: column;
        max-width: 80%;
      }
      .message-own {
        align-self: flex-end;
      }
      .message-admin {
        align-self: flex-start;
      }
      .message-bubble {
        padding: 1rem;
        border-radius: 12px;
        position: relative;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
      .message-own .message-bubble {
        background: #dbeafe;
        border-bottom-right-radius: 2px;
      }
      .message-admin .message-bubble {
        background: white;
        border-bottom-left-radius: 2px;
      }
      .message-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
        font-size: 0.8rem;
        color: var(--text-muted);
      }
      .author {
        font-weight: 600;
        color: var(--text-secondary);
      }
      .message-content {
        color: var(--text-primary);
        line-height: 1.5;
      }
      .message-date {
        font-size: 0.7rem;
        color: var(--text-muted);
        text-align: right;
        margin-top: 0.25rem;
      }

      .response-area {
        padding: 1.5rem;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        background: white;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
      .input-group {
        display: flex;
        gap: 0.75rem;
      }
      textarea {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--neutral-medium);
        border-radius: 8px;
        resize: none;
        font-family: inherit;
      }
      textarea:focus {
        outline: none;
        border-color: var(--primary-cyan);
      }
      .btn-send {
        width: 50px;
        background: var(--primary-cyan);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }
      .btn-send:hover:not(:disabled) {
        background: #0891b2;
      }
      .btn-send:disabled {
        background: var(--neutral-medium);
        cursor: not-allowed;
      }

      .archived-notice {
        padding: 1.5rem;
        background: #f1f5f9;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        text-align: center;
        color: var(--text-secondary);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      .archived-notice i {
        font-size: 2rem;
        opacity: 0.5;
      }

      /* Badges */
      .status-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .status-new {
        background: #fef3c7;
        color: #d97706;
      }
      .status-process {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .status-resolved {
        background: #d1fae5;
        color: #059669;
      }
      .status-archived {
        background: #f1f5f9;
        color: #475569;
      }

      .loading-state,
      .error-state {
        text-align: center;
        padding: 4rem;
        color: var(--text-muted);
      }
      .error-state i {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      .alert {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
      }
      .alert-success {
        background: #f0fdf4;
        color: #15803d;
      }
      .alert-danger {
        background: #fef2f2;
        color: #ef4444;
      }
      .mt-2 {
        margin-top: 0.5rem;
      }
      .me-2 {
        margin-right: 0.5rem;
      }
      .btn-secondary {
        padding: 0.5rem 1rem;
        background: white;
        color: var(--text-primary);
        border: 1px solid var(--neutral-medium);
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        display: inline-block;
      }
    `,
  ],
})
export class DetallePqrsPaciente implements OnInit {
  pqrs: InfoPQRSDTO | null = null;
  isLoading = true;
  isSubmitting = false;
  nuevoMensaje = '';
  successMessage = '';
  errorMessage = '';
  codigoPaciente = 0;

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const codigo = this.route.snapshot.params['codigo'];
    this.codigoPaciente = this.tokenService.getCodigo();

    if (codigo) {
      this.loadPqrs(codigo);
    }
  }

  loadPqrs(codigo: number): void {
    this.pacienteService.verDetallePQRS(codigo).subscribe({
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

    const respuesta: RespuestaPacientePqrsDTO = {
      codigoPqrs: this.pqrs.codigo,
      mensaje: this.nuevoMensaje.trim(),
      respuestaAdmin: 0,
      codigoPaciente: this.codigoPaciente,
    };

    this.pacienteService.responderPQRS(respuesta).subscribe({
      next: (response) => {
        this.successMessage = 'Respuesta enviada exitosamente';
        this.nuevoMensaje = '';
        this.loadPqrs(this.pqrs!.codigo);
        this.isSubmitting = false;
        this.cd.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cd.detectChanges();
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.respuesta || 'Error al enviar respuesta';
        this.isSubmitting = false;
        this.cd.detectChanges();
      },
    });
  }

  isMyMessage(codigoCuenta: number): boolean {
    return codigoCuenta === this.codigoPaciente;
  }
}
