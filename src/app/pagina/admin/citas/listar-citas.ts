import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { CitaDTOAdmin } from '../../../modelo/cita-dto-admin';

@Component({
    selector: 'app-listar-citas',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="citas-page">
      <h2>Citas Programadas</h2>

      <div *ngIf="isLoading" class="loading">Cargando citas...</div>

      <div *ngIf="!isLoading && citas.length === 0" class="empty-state">
        No hay citas programadas
      </div>

      <div *ngIf="!isLoading && citas.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cita of citas">
              <td>{{ cita.codigo }}</td>
              <td>{{ cita.paciente }}</td>
              <td>{{ cita.medico }}</td>
              <td>{{ cita.fecha }}</td>
              <td>{{ cita.hora }}</td>
              <td>{{ cita.motivo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .citas-page { padding: 1rem; }
    h2 { margin-bottom: 2rem; }
    .loading, .empty-state { text-align: center; padding: 3rem; color: #7f8c8d; }
    .table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { background: #f8f9fa; font-weight: 600; }
  `]
})
export class ListarCitas implements OnInit {
    citas: CitaDTOAdmin[] = [];
    isLoading = true;

    constructor(private adminService: AdministradorService) { }

    ngOnInit(): void {
        this.adminService.listarCitas().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.citas = response.respuesta;
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
            }
        });
    }
}
