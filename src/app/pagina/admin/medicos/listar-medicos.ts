import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { ItemMedicoDTO } from '../../../modelo/item-medico-dto';

@Component({
    selector: 'app-listar-medicos',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="medicos-page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Gestión de Médicos</h2>
          <p class="text-muted">Administra el personal médico de la clínica</p>
        </div>
        <a routerLink="/admin/medicos/crear" class="btn-primary">
          <i class="bi bi-person-plus-fill"></i> Nuevo Médico
        </a>
      </div>

      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando lista de médicos...</p>
      </div>

      <div *ngIf="!isLoading && medicos.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-people"></i>
        </div>
        <h3>No hay médicos registrados</h3>
        <p>Comienza registrando un nuevo médico en el sistema.</p>
        <a routerLink="/admin/medicos/crear" class="btn-secondary mt-3">Registrar Médico</a>
      </div>

      <div *ngIf="!isLoading && medicos.length > 0" class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let medico of medicos">
              <td><span class="badge-code">#{{ medico.codigo }}</span></td>
              <td>{{ medico.cedula }}</td>
              <td class="fw-bold text-primary">{{ medico.nombre }}</td>
              <td><span class="badge-specialty">{{ medico.especialidad.nombre }}</span></td>
              <td>{{ medico.telefono }}</td>
              <td>{{ medico.correo }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-edit" [routerLink]="['/admin/medicos/editar', medico.codigo]" title="Editar">
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button class="btn-icon btn-delete" (click)="eliminarMedico(medico.codigo)" title="Eliminar">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center mt-4">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ errorMessage }}
      </div>
    </div>
  `,
    styles: [`
    .medicos-page { padding: 0; }
    .page-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 2rem; 
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .btn-primary { 
      padding: 0.75rem 1.5rem; 
      background: var(--gradient-primary); 
      color: white; 
      text-decoration: none; 
      border-radius: 10px; 
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-md);
      border: none;
    }
    .btn-primary:hover { 
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
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
    .badge-specialty {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary-blue);
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-edit {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary-blue);
    }
    .btn-edit:hover {
      background: var(--primary-blue);
      color: white;
    }
    .btn-delete {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }
    .btn-delete:hover {
      background: #EF4444;
      color: white;
    }
    .btn-secondary {
      background: white;
      border: 1px solid var(--neutral-medium);
      color: var(--text-primary);
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      text-decoration: none;
      display: inline-block;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      background: var(--neutral-light);
    }
  `]
})
export class ListarMedicos implements OnInit {
    medicos: ItemMedicoDTO[] = [];
    isLoading = true;
    errorMessage = '';

    constructor(
        private adminService: AdministradorService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadMedicos();
    }

    loadMedicos(): void {
        this.isLoading = true;
        this.adminService.listarMedicos().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.medicos = response.respuesta;
                }
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (error) => {
                this.errorMessage = 'Error al cargar médicos';
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }

    eliminarMedico(codigo: number): void {
        if (confirm('¿Está seguro de eliminar este médico?')) {
            this.adminService.eliminarMedico(codigo).subscribe({
                next: () => {
                    this.loadMedicos();
                },
                error: (error) => {
                    this.errorMessage = 'Error al eliminar médico';
                    this.cd.detectChanges();
                }
            });
        }
    }
}
