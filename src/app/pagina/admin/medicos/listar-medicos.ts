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
        <h2>Gestión de Médicos</h2>
        <a routerLink="/admin/medicos/crear" class="btn-primary">+ Crear Médico</a>
      </div>

      <div *ngIf="isLoading" class="loading">Cargando médicos...</div>

      <div *ngIf="!isLoading && medicos.length === 0" class="empty-state">
        No hay médicos registrados
      </div>

      <div *ngIf="!isLoading && medicos.length > 0" class="table-container">
        <table>
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
              <td>{{ medico.codigo }}</td>
              <td>{{ medico.cedula }}</td>
              <td>{{ medico.nombre }}</td>
              <td>{{ medico.especialidad.nombre }}</td>
              <td>{{ medico.telefono }}</td>
              <td>{{ medico.correo }}</td>
              <td>
                <button class="btn-sm btn-primary" [routerLink]="['/admin/medicos/editar', medico.codigo]">Editar</button>
                <button class="btn-sm btn-danger" (click)="eliminarMedico(medico.codigo)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
    </div>
  `,
    styles: [`
    .medicos-page { padding: 1rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .btn-primary { padding: 0.75rem 1.5rem; background: #3498db; color: white; text-decoration: none; border-radius: 6px; }
    .btn-primary:hover { background: #2980b9; }
    .loading, .empty-state { text-align: center; padding: 3rem; color: #7f8c8d; }
    .table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { background: #f8f9fa; font-weight: 600; }
    .btn-sm { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem; }
    .btn-danger { background: #e74c3c; color: white; }
    .btn-danger:hover { background: #c0392b; }
    .alert { padding: 1rem; margin-top: 1rem; border-radius: 6px; }
    .alert-error { background: #fee; color: #c33; }
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
