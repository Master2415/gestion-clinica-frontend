import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { ItemPqrsAdminDTO } from '../../../modelo/item-pqrs-admin-dto';

@Component({
    selector: 'app-listar-pqrs',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="pqrs-page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Gestión de PQRS</h2>
          <p class="text-muted">Administra las peticiones, quejas, reclamos y sugerencias</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando lista de PQRS...</p>
      </div>

      <div *ngIf="!isLoading && pqrs.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <h3>No hay PQRS registrados</h3>
        <p>Actualmente no hay solicitudes pendientes de revisión.</p>
      </div>

      <div *ngIf="!isLoading && pqrs.length > 0" class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Motivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of pqrs">
              <td><span class="badge-code">#{{ item.codigo }}</span></td>
              <td class="fw-bold text-primary">{{ item.nombrePaciente }}</td>
              <td>{{ item.fecha | date:'mediumDate' }}</td>
              <td>
                <span class="status-badge" [ngClass]="{
                  'status-pending': item.estadoPqrs.estado !== 'RESUELTO',
                  'status-resolved': item.estadoPqrs.estado === 'RESUELTO'
                }">
                  {{ item.estadoPqrs.estado }}
                </span>
              </td>
              <td>{{ item.motivo }}</td>
              <td>
                <a [routerLink]="['/admin/pqrs', item.codigo]" class="btn-action">
                  Ver Detalle <i class="bi bi-arrow-right-short"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .pqrs-page { padding: 0; }
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
      border: 1px solid rgba(0,0,0,0.05);
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
      background: #F8FAFC;
    }
    .badge-code {
      background: var(--neutral-light);
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 600;
      color: var(--text-primary);
    }
    .status-badge {
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-block;
    }
    .status-pending {
      background: #FFF7ED;
      color: #C2410C;
    }
    .status-resolved {
      background: #F0FDF4;
      color: #15803D;
    }
    .btn-action {
      background: white;
      border: 1px solid var(--primary-blue);
      color: var(--primary-blue);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .btn-action:hover {
      background: var(--primary-blue);
      color: white;
    }
  `]
})
export class ListarPqrs implements OnInit {
    pqrs: ItemPqrsAdminDTO[] = [];
    isLoading = true;

    constructor(
        private adminService: AdministradorService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.adminService.listarPQRS().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.pqrs = response.respuesta;
                }
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (error) => {
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }
}
