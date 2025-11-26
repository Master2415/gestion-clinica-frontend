import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { ClinicaService } from '../../../servicios/clinica.service';
import { RegistroMedicoDTO } from '../../../modelo/registro-medico-dto';
import { Especialidad } from '../../../modelo/especialidad';
import { Ciudad } from '../../../modelo/ciudad';

@Component({
    selector: 'app-crear-medico',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="crear-medico">
      <h2>Crear Nuevo Médico</h2>

      <form (ngSubmit)="crearMedico()" class="medico-form">
        <div class="form-group">
          <label>Cédula *</label>
          <input type="text" [(ngModel)]="medico.cedula" name="cedula" required>
        </div>

        <div class="form-group">
          <label>Nombre *</label>
          <input type="text" [(ngModel)]="medico.nombre" name="nombre" required>
        </div>

        <div class="form-group">
          <label>Correo *</label>
          <input type="email" [(ngModel)]="medico.correo" name="correo" required>
        </div>

        <div class="form-group">
          <label>Contraseña *</label>
          <input type="password" [(ngModel)]="medico.contrasena" name="contrasena" required>
        </div>

        <div class="form-group">
          <label>Teléfono *</label>
          <input type="tel" [(ngModel)]="medico.telefono" name="telefono" required>
        </div>

        <div class="form-group">
          <label>URL Foto</label>
          <input type="url" [(ngModel)]="medico.urlFoto" name="urlFoto">
        </div>

        <div class="form-group">
          <label>Ciudad *</label>
          <select [(ngModel)]="ciudadSeleccionada" name="ciudad" required (change)="onCiudadChange()">
            <option value="">Seleccione una ciudad</option>
            <option *ngFor="let ciudad of ciudades" [value]="ciudad.codigo">{{ ciudad.nombre }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Especialidad *</label>
          <select [(ngModel)]="especialidadSeleccionada" name="especialidad" required (change)="onEspecialidadChange()">
            <option value="">Seleccione una especialidad</option>
            <option *ngFor="let esp of especialidades" [value]="esp.codigo">{{ esp.nombre }}</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="isLoading" class="btn-primary">
            {{ isLoading ? 'Creando...' : 'Crear Médico' }}
          </button>
          <button type="button" (click)="cancelar()" class="btn-secondary">Cancelar</button>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
        <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
      </form>
    </div>
  `,
    styles: [`
    .crear-medico { max-width: 600px; padding: 2rem; }
    h2 { margin-bottom: 2rem; }
    .medico-form { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input, select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
    .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
    .btn-primary, .btn-secondary { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; }
    .btn-primary { background: #3498db; color: white; }
    .btn-primary:hover { background: #2980b9; }
    .btn-primary:disabled { background: #95a5a6; cursor: not-allowed; }
    .btn-secondary { background: #ecf0f1; color: #2c3e50; }
    .btn-secondary:hover { background: #bdc3c7; }
    .alert { padding: 1rem; margin-top: 1rem; border-radius: 6px; }
    .alert-error { background: #fee; color: #c33; }
    .alert-success { background: #efe; color: #3c3; }
  `]
})
export class CrearMedico implements OnInit {
    medico: RegistroMedicoDTO = new RegistroMedicoDTO();
    ciudades: Ciudad[] = [];
    especialidades: Especialidad[] = [];
    ciudadSeleccionada = '';
    especialidadSeleccionada = '';
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private adminService: AdministradorService,
        private clinicaService: ClinicaService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.clinicaService.listarCiudades().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.ciudades = response.respuesta;
                }
            }
        });

        this.clinicaService.listarEspecialidades().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.especialidades = response.respuesta;
                }
            }
        });
    }

    onCiudadChange(): void {
        const ciudad = this.ciudades.find(c => c.codigo === parseInt(this.ciudadSeleccionada));
        if (ciudad) {
            this.medico.ciudad = { codigo: ciudad.codigo, nombre: ciudad.nombre };
        }
    }

    onEspecialidadChange(): void {
        const esp = this.especialidades.find(e => e.codigo === parseInt(this.especialidadSeleccionada));
        if (esp) {
            this.medico.especialidad = { codigo: esp.codigo, nombre: esp.nombre };
        }
    }

    crearMedico(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.adminService.crearMedico(this.medico).subscribe({
            next: (response) => {
                this.successMessage = 'Médico creado exitosamente';
                this.isLoading = false;
                setTimeout(() => {
                    this.router.navigate(['/admin/medicos']);
                }, 1500);
            },
            error: (error) => {
                this.errorMessage = error.error?.respuesta || 'Error al crear médico';
                this.isLoading = false;
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/admin/medicos']);
    }
}
