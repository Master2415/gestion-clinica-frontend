import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { ItemPqrsAdminDTO } from '../../../modelo/item-pqrs-admin-dto';

@Component({
    selector: 'app-listar-pqrs',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="pqrs-page">
      <h2>Gestión de PQRS</h2>

      <div *ngIf="isLoading" class="loading">Cargando PQRS...</div>

      <div *ngIf="!isLoading && pqrs.length === 0" class="empty-state">
        No hay PQRS registrados
      </div>

      <div *ngIf="!isLoading && pqrs.length > 0" class="table-container">
        <table>
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
              <td>{{ item.codigo }}</td>
              <td>{{ item.nombrePaciente }}</td>
              <td>{{ item.fechaCreacion }}</td>
              <td><span class="badge" [class.badge-pending]="item.estado !== 'RESUELTO'">{{ item.estado }}</span></td>
              <td>{{ item.motivo }}</td>
              <td>
                <a [routerLink]="['/admin/pqrs', item.codigo]" class="btn-sm btn-info">Ver Detalle</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .pqrs-page { padding: 1rem; }
    h2 { margin-bottom: 2rem; }
    .loading, .empty-state { text-align: center; padding: 3rem; color: #7f8c8d; }
    .table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { background: #f8f9fa; font-weight: 600; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; }
    .badge-pending { background: #fff3cd; color: #856404; }
    .btn-sm { padding: 0.5rem 1rem; border: none; border-radius: 4px; text-decoration: none; display: inline-block; }
    .btn-info { background: #3498db; color: white; }
    .btn-info:hover { background: #2980b9; }
  `]
})
export class ListarPqrs implements OnInit {
    pqrs: ItemPqrsAdminDTO[] = [];
    isLoading = true;

    constructor(private adminService: AdministradorService) { }

    ngOnInit(): void {
        this.adminService.listarPQRS().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.pqrs = response.respuesta;
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
            }
        });
    }
}
