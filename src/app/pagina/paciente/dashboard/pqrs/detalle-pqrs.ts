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
    <div class="page-container" *ngIf="pqrs">
      <div class="page-header">
        <div class="header-content">
          <h2 class="page-title">Detalle PQRS #{{ pqrs.codigo }}</h2>
          <p class="text-muted">Seguimiento detallado de tu solicitud</p>
        </div>
        <a routerLink="/paciente/mis-pqrs" class="btn-secondary">
          <i class="bi bi-arrow-left"></i> Volver
        </a>
      </div>

      <div class="content-grid">
        <!-- Info Card -->
        <div class="info-card">
          <div class="card-header">
            <div class="status-wrapper">
              <span class="status-badge" 
                    [class.status-new]="pqrs.estado.estado === 'NUEVO'"
                    [class.status-process]="pqrs.estado.estado === 'EN_PROCESO'"
                    [class.status-resolved]="pqrs.estado.estado === 'RESUELTO'"
                    [class.status-archived]="pqrs.estado.estado === 'ARCHIVADO'">
                {{ pqrs.estado.estado }}
              </span>
              <span class="date-badge">
                <i class="bi bi-calendar-event"></i>
                {{ pqrs.fecha | date:'medium' }}
              </span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="info-group">
              <label><i class="bi bi-chat-square-text"></i> Motivo</label>
              <p>{{ pqrs.motivo }}</p>
            </div>
            
            <div class="info-group">
              <label><i class="bi bi-person-badge"></i> Médico Relacionado</label>
              <div class="doctor-info">
                <div class="doctor-avatar">
                  <i class="bi bi-person-fill"></i>
                </div>
                <div>
                  <p class="doctor-name">{{ pqrs.nombreMedico }}</p>
                  <p class="doctor-spec">{{ pqrs.especializacion.nombre }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Section -->
        <div class="chat-section">
          <div class="chat-header">
            <h3><i class="bi bi-chat-dots"></i> Historial de Mensajes</h3>
          </div>
          
          <div class="messages-container">
            <div class="message" *ngFor="let msg of pqrs.mensajes"
                 [class.message-own]="isMyMessage(msg.codigoCuenta)"
                 [class.message-admin]="!isMyMessage(msg.codigoCuenta)">
              <div class="message-bubble">
                <div class="message-header">
                  <span class="author">
                    <i class="bi" [class.bi-person-circle]="isMyMessage(msg.codigoCuenta)" 
                       [class.bi-headset]="!isMyMessage(msg.codigoCuenta)"></i>
                    {{ isMyMessage(msg.codigoCuenta) ? 'Yo' : 'Administrador' }}
                  </span>
                  <span class="date">{{ msg.fechaCreacion | date:'short' }}</span>
                </div>
                <div class="message-content">
                  {{ msg.mensaje }}
                </div>
              </div>
            </div>
            
            <div *ngIf="pqrs.mensajes.length === 0" class="empty-messages">
              <i class="bi bi-chat-square-dots"></i>
              <p>No hay mensajes en el historial aún</p>
            </div>
          </div>

          <div class="response-form" *ngIf="pqrs.estado.estado !== 'ARCHIVADO'">
            <h4><i class="bi bi-reply-fill"></i> Responder</h4>
            <div class="textarea-wrapper">
              <textarea 
                [(ngModel)]="nuevoMensaje" 
                placeholder="Escribe tu respuesta aquí..."
                rows="4"
                [disabled]="isSubmitting"
                class="form-control"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button 
                (click)="enviarRespuesta()" 
                [disabled]="!nuevoMensaje.trim() || isSubmitting"
                class="btn-primary">
                <span *ngIf="!isSubmitting"><i class="bi bi-send-fill"></i> Enviar Respuesta</span>
                <span *ngIf="isSubmitting"><span class="spinner-border spinner-border-sm"></span> Enviando...</span>
              </button>
            </div>
            
            <div *ngIf="successMessage" class="alert alert-success">
              <i class="bi bi-check-circle-fill"></i> {{ successMessage }}
            </div>
            <div *ngIf="errorMessage" class="alert alert-danger">
              <i class="bi bi-exclamation-circle-fill"></i> {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div *ngIf="isLoading" class="loading-state">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando información...</p>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1000px; margin: 0 auto; }
    
    .page-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 2rem; 
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0; }
    .text-muted { color: var(--text-secondary); margin: 0.25rem 0 0 0; }
    
    .btn-secondary { 
      padding: 0.5rem 1rem; 
      background: white; 
      color: var(--text-primary); 
      border: 1px solid var(--neutral-medium);
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    
    .btn-secondary:hover { background: var(--neutral-light); }
    
    .content-grid { display: grid; gap: 2rem; }
    
    /* Info Card */
    .info-card { 
      background: white; 
      border-radius: 16px; 
      box-shadow: var(--shadow-sm); 
      overflow: hidden; 
      border: 1px solid rgba(0,0,0,0.05);
    }
    
    .card-header { 
      padding: 1.5rem; 
      background: var(--neutral-light); 
      border-bottom: 1px solid rgba(0,0,0,0.05); 
    }
    
    .status-wrapper { display: flex; justify-content: space-between; align-items: center; }
    
    .status-badge { 
      padding: 0.35rem 0.85rem; 
      border-radius: 20px; 
      font-weight: 700; 
      font-size: 0.8rem; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-new { background: #EFF6FF; color: #1D4ED8; border: 1px solid #DBEAFE; }
    .status-process { background: #FFF7ED; color: #C2410C; border: 1px solid #FFEDD5; }
    .status-resolved { background: #F0FDF4; color: #15803D; border: 1px solid #DCFCE7; }
    .status-archived { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
    
    .date-badge { 
      display: flex; 
      align-items: center; 
      gap: 0.5rem; 
      color: var(--text-secondary); 
      font-size: 0.9rem; 
      font-weight: 500;
    }
    
    .card-body { padding: 2rem; display: grid; gap: 1.5rem; }
    
    .info-group label { 
      display: flex; 
      align-items: center; 
      gap: 0.5rem; 
      font-weight: 600; 
      color: var(--text-secondary); 
      margin-bottom: 0.5rem; 
      font-size: 0.9rem;
      text-transform: uppercase;
    }
    
    .info-group p { font-size: 1.1rem; color: var(--text-primary); margin: 0; line-height: 1.6; }
    
    .doctor-info { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
    .doctor-avatar { 
      width: 48px; 
      height: 48px; 
      background: var(--neutral-light); 
      color: var(--primary-cyan); 
      border-radius: 12px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 1.5rem; 
    }
    .doctor-name { font-weight: 600; font-size: 1.1rem; color: var(--text-primary); }
    .doctor-spec { font-size: 0.9rem; color: var(--text-secondary); }
    
    /* Chat Section */
    .chat-section { 
      background: white; 
      border-radius: 16px; 
      box-shadow: var(--shadow-sm); 
      border: 1px solid rgba(0,0,0,0.05);
      overflow: hidden;
    }
    
    .chat-header { 
      padding: 1.5rem; 
      border-bottom: 1px solid var(--neutral-light);
      background: white;
    }
    
    .chat-header h3 { margin: 0; font-size: 1.25rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.75rem; }
    
    .messages-container { 
      max-height: 500px; 
      overflow-y: auto; 
      padding: 2rem; 
      background: #F8FAFC; 
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .message { display: flex; width: 100%; }
    .message-own { justify-content: flex-end; }
    .message-admin { justify-content: flex-start; }
    
    .message-bubble { 
      max-width: 80%; 
      padding: 1.25rem; 
      border-radius: 16px; 
      box-shadow: var(--shadow-sm);
      position: relative;
    }
    
    .message-own .message-bubble { 
      background: var(--gradient-primary); 
      color: white; 
      border-bottom-right-radius: 4px;
    }
    
    .message-admin .message-bubble { 
      background: white; 
      color: var(--text-primary); 
      border-bottom-left-radius: 4px;
      border: 1px solid var(--neutral-medium);
    }
    
    .message-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 0.5rem; 
      font-size: 0.85rem; 
      opacity: 0.9;
    }
    
    .author { font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }
    
    .empty-messages { 
      text-align: center; 
      padding: 3rem; 
      color: var(--text-muted); 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 1rem;
    }
    .empty-messages i { font-size: 2.5rem; opacity: 0.5; }
    
    .response-form { padding: 2rem; background: white; border-top: 1px solid var(--neutral-light); }
    .response-form h4 { margin: 0 0 1rem 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; }
    
    .form-control { 
      width: 100%; 
      padding: 1rem; 
      border: 1px solid var(--neutral-medium); 
      border-radius: 12px; 
      font-size: 1rem; 
      resize: vertical; 
      transition: all 0.2s;
    }
    
    .form-control:focus { 
      outline: none; 
      border-color: var(--primary-blue); 
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
    }
    
    .btn-primary { 
      padding: 0.875rem 2rem; 
      background: var(--gradient-primary); 
      color: white; 
      border: none; 
      border-radius: 8px; 
      font-weight: 600; 
      cursor: pointer; 
      margin-top: 1rem; 
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    
    .alert { padding: 1rem; margin-top: 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; }
    .alert-success { background: #F0FDF4; color: #15803D; border: 1px solid #DCFCE7; }
    .alert-danger { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
    
    .loading-state { text-align: center; padding: 4rem; color: var(--text-muted); }
  `]
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
      }
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
      respuestaAdmin: 0, // Not replying to specific admin message
      codigoPaciente: this.codigoPaciente
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
      }
    });
  }

  isMyMessage(codigoCuenta: number): boolean {
    return codigoCuenta === this.codigoPaciente;
  }
}
