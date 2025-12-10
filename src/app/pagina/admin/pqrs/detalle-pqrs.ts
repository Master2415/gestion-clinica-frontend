import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { InfoPQRSDTO } from '../../../modelo/info-pqrs-dto';
import { RespuestaAdminDTO } from '../../../modelo/respuesta-admin-dto';
import { TokenService } from '../../../servicios/token';
import { ClinicaService } from '../../../servicios/clinica.service';

@Component({
  selector: 'app-detalle-pqrs',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="detalle-page" *ngIf="pqrs">
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/admin/pqrs" class="back-link">
            <i class="bi bi-arrow-left"></i> Volver a la lista
          </a>
          <h2 class="page-title">Detalle de Solicitud <span class="text-primary">#{{ pqrs.codigo }}</span></h2>
        </div>
        <div class="header-actions">
          <span
            class="status-badge"
            [ngClass]="{
              'status-new': pqrs.estado.estado === 'NUEVO',
              'status-process': pqrs.estado.estado === 'EN_PROCESO',
              'status-resolved': pqrs.estado.estado === 'RESUELTO'
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
            <div class="info-row">
              <div class="info-item">
                <label>Paciente</label>
                <p class="fw-bold">{{ pqrs.nombrePaciente }}</p>
              </div>
              <div class="info-item">
                <label>Médico Relacionado</label>
                <p>{{ pqrs.nombreMedico }} <span class="text-muted">({{ pqrs.especializacion.nombre }})</span></p>
              </div>
            </div>

            <div class="info-item mt-3">
              <label>Motivo de la Solicitud</label>
              <p class="motivo-text">{{ pqrs.motivo }}</p>
            </div>
          </div>
          
          <div class="status-change-section">
            <label for="estadoSelector" class="section-label">Actualizar Estado</label>
            <div class="status-controls">
              <div class="select-wrapper">
                <select id="estadoSelector" [(ngModel)]="nuevoEstado" [disabled]="isCambiandoEstado">
                  <option value="" disabled selected>Seleccionar estado...</option>
                  <option *ngFor="let estado of estadosPqrs" [value]="estado.codigo">{{ estado.estado }}</option>
                </select>
                <i class="bi bi-chevron-down select-icon"></i>
              </div>
              <button 
                (click)="cambiarEstado()" 
                [disabled]="!nuevoEstado || isCambiandoEstado"
                class="btn-change-status">
                <span *ngIf="isCambiandoEstado" class="spinner-border spinner-border-sm me-2"></span>
                {{ isCambiandoEstado ? 'Actualizando...' : 'Actualizar' }}
              </button>
            </div>
            <div *ngIf="statusChangeSuccess" class="alert alert-success mt-2">
              <i class="bi bi-check-circle-fill me-2"></i> {{ statusChangeSuccess }}
            </div>
            <div *ngIf="statusChangeError" class="alert alert-danger mt-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ statusChangeError }}
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
              [class.message-admin]="isAdminMessage(msg.codigoCuenta)"
              [class.message-user]="!isAdminMessage(msg.codigoCuenta)"
            >
              <div class="message-bubble">
                <div class="message-meta">
                  <span class="author">
                    {{ isAdminMessage(msg.codigoCuenta) ? 'Administrador' : 'Paciente' }}
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

          <div class="response-area">
            <div class="input-group">
              <textarea
                [(ngModel)]="nuevoMensaje"
                placeholder="Escribe una respuesta para el paciente..."
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
        </div>
      </div>
    </div>

    <div *ngIf="!pqrs && !isLoading" class="error-state">
      <i class="bi bi-search"></i>
      <h3>No encontrado</h3>
      <p>No se encontró la información del PQRS solicitado.</p>
      <a routerLink="/admin/pqrs" class="btn-secondary mt-3">Volver a la lista</a>
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
        color: var(--primary-blue);
      }
      .page-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
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
        border-bottom: 1px solid rgba(0,0,0,0.05);
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
      .card-body {
        padding: 1.5rem;
      }
      .info-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
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
      .motivo-text {
        background: var(--neutral-light);
        padding: 1rem;
        border-radius: 8px;
        line-height: 1.5;
        color: var(--text-secondary);
      }
      
      /* Status Section */
      .status-change-section {
        padding: 1.5rem;
        background: #F8FAFC;
        border-top: 1px solid rgba(0,0,0,0.05);
      }
      .section-label {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.75rem;
      }
      .status-controls {
        display: flex;
        gap: 0.75rem;
      }
      .select-wrapper {
        position: relative;
        flex: 1;
      }
      .select-wrapper select {
        width: 100%;
        padding: 0.6rem 1rem;
        border: 1px solid var(--neutral-medium);
        border-radius: 8px;
        appearance: none;
        background: white;
        font-size: 0.95rem;
      }
      .select-icon {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--text-muted);
      }
      .btn-change-status {
        padding: 0.6rem 1.2rem;
        background: var(--doctor-green);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-change-status:hover:not(:disabled) {
        background: #047857;
      }
      .btn-change-status:disabled {
        background: var(--neutral-medium);
        cursor: not-allowed;
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
        border-bottom: 1px solid rgba(0,0,0,0.05);
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
        background: #F1F5F9;
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
      .message-user {
        align-self: flex-start;
      }
      .message-admin {
        align-self: flex-end;
      }
      .message-bubble {
        padding: 1rem;
        border-radius: 12px;
        position: relative;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      .message-user .message-bubble {
        background: white;
        border-bottom-left-radius: 2px;
      }
      .message-admin .message-bubble {
        background: #DBEAFE;
        border-bottom-right-radius: 2px;
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
        border-top: 1px solid rgba(0,0,0,0.05);
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
        border-color: var(--primary-blue);
      }
      .btn-send {
        width: 50px;
        background: var(--primary-blue);
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
        background: var(--primary-cyan);
      }
      .btn-send:disabled {
        background: var(--neutral-medium);
        cursor: not-allowed;
      }

      /* Badges */
      .status-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .status-new {
        background: #FEF3C7;
        color: #D97706;
      }
      .status-process {
        background: #DBEAFE;
        color: #1D4ED8;
      }
      .status-resolved {
        background: #D1FAE5;
        color: #059669;
      }
      
      .loading-state, .error-state {
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
        background: #F0FDF4;
        color: #15803D;
      }
      .alert-danger {
        background: #FEF2F2;
        color: #EF4444;
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
  nuevoEstado = '';
  isCambiandoEstado = false;
  statusChangeSuccess = '';
  statusChangeError = '';
  estadosPqrs: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private adminService: AdministradorService,
    private tokenService: TokenService,
    private clinicaService: ClinicaService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const codigo = this.route.snapshot.params['codigo'];
    if (codigo) {
      this.loadPqrs(codigo);
    }

    // Get admin account code from token
    this.codigoCuenta = this.tokenService.getCodigo();
    
    // Load states
    this.loadEstadosPqrs();
  }

  loadEstadosPqrs(): void {
    this.clinicaService.listarEstadosPqrs().subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.estadosPqrs = response.respuesta;
        }
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando estados', error);
      }
    });
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
        this.cd.detectChanges();

        // Clear success message after 3 seconds
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

  isAdminMessage(codigoCuenta: number): boolean {
    // Simple check: if the message is from current admin account
    return codigoCuenta === this.codigoCuenta;
  }

  cambiarEstado(): void {
    if (!this.pqrs || !this.nuevoEstado) return;
    
    this.isCambiandoEstado = true;
    this.statusChangeError = '';
    this.statusChangeSuccess = '';
    
    this.adminService.cambiarEstadoPQRS(this.pqrs.codigo, parseInt(this.nuevoEstado)).subscribe({
      next: (response) => {
        this.statusChangeSuccess = 'Estado actualizado exitosamente';
        // Reload PQRS to show updated status
        this.loadPqrs(this.pqrs!.codigo);
        this.isCambiandoEstado = false;
        this.cd.detectChanges();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.statusChangeSuccess = '';
          this.cd.detectChanges();
        }, 3000);
      },
      error: (error) => {
        this.statusChangeError = error.error?.respuesta || 'Error al cambiar estado';
        this.isCambiandoEstado = false;
        this.cd.detectChanges();
      }
    });
  }
}
