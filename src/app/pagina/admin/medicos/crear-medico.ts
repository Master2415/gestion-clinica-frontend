import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
      <h2>{{ isEditing ? 'Editar Médico' : 'Crear Nuevo Médico' }}</h2>

      <form (ngSubmit)="guardarMedico()" class="medico-form">
        <div class="form-group">
          <label>Cédula *</label>
          <input type="text" [(ngModel)]="medico.cedula" name="cedula" required />
        </div>

        <div class="form-group">
          <label>Nombre *</label>
          <input type="text" [(ngModel)]="medico.nombre" name="nombre" required />
        </div>

        <div class="form-group">
          <label>Correo *</label>
          <input type="email" [(ngModel)]="medico.correo" name="correo" required />
        </div>

        <div class="form-group" *ngIf="!isEditing">
          <label>Contraseña *</label>
          <input type="password" [(ngModel)]="medico.contrasena" name="contrasena" required />
        </div>

        <div class="form-group">
          <label>Teléfono *</label>
          <input type="tel" [(ngModel)]="medico.telefono" name="telefono" required />
        </div>

        <div class="form-group">
          <label>Dirección *</label>
          <input type="text" [(ngModel)]="medico.direccion" name="direccion" required />
        </div>

        <div class="form-group">
          <label>URL Foto</label>
          <input type="url" [(ngModel)]="medico.urlFoto" name="urlFoto" />
        </div>

        <div class="form-group">
          <label>Ciudad *</label>
          <select
            [(ngModel)]="ciudadSeleccionada"
            name="ciudad"
            required
            (change)="onCiudadChange()"
          >
            <option value="">Seleccione una ciudad</option>
            <option *ngFor="let ciudad of ciudades" [value]="ciudad.codigo">
              {{ ciudad.nombre }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Especialidad *</label>
          <select
            [(ngModel)]="especialidadSeleccionada"
            name="especialidad"
            required
            (change)="onEspecialidadChange()"
          >
            <option value="">Seleccione una especialidad</option>
            <option *ngFor="let esp of especialidades" [value]="esp.codigo">
              {{ esp.nombre }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="isLoading" class="btn-primary">
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Médico') }}
          </button>
          <button type="button" (click)="cancelar()" class="btn-secondary">Cancelar</button>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
        <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
      </form>
    </div>
  `,
  styles: [
    `
      .crear-medico {
        max-width: 600px;
        padding: 2rem;
      }
      h2 {
        margin-bottom: 2rem;
      }
      .medico-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .form-group {
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      input,
      select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }
      .btn-primary,
      .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      .btn-primary {
        background: #3498db;
        color: white;
      }
      .btn-primary:hover {
        background: #2980b9;
      }
      .btn-primary:disabled {
        background: #95a5a6;
        cursor: not-allowed;
      }
      .btn-secondary {
        background: #ecf0f1;
        color: #2c3e50;
      }
      .btn-secondary:hover {
        background: #bdc3c7;
      }
      .alert {
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 6px;
      }
      .alert-error {
        background: #fee;
        color: #c33;
      }
      .alert-success {
        background: #efe;
        color: #3c3;
      }
    `,
  ],
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
  isEditing = false;
  codigoMedico: number | null = null;

  constructor(
    private adminService: AdministradorService,
    private clinicaService: ClinicaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize default values for required fields
    this.medico.horarios = [];
    this.medico.estadoMedico = { codigo: 1, nombre: 'ACTIVO' }; // Default to ACTIVO
    this.medico.urlFoto = ''; // Ensure it's not undefined
  }

  ngOnInit(): void {
    this.loadCiudades();
    this.loadEspecialidades();

    // Check if we are in edit mode
    this.route.params.subscribe((params) => {
      if (params['codigo']) {
        this.isEditing = true;
        this.codigoMedico = +params['codigo'];
        this.loadMedicoData(this.codigoMedico);
      }
    });
  }

  loadCiudades(): void {
    this.clinicaService.listarCiudades().subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.ciudades = response.respuesta;
        }
      },
    });
  }

  loadEspecialidades(): void {
    this.clinicaService.listarEspecialidades().subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.especialidades = response.respuesta;
        }
      },
    });
  }

  loadMedicoData(codigo: number): void {
    this.isLoading = true;
    this.adminService.obtenerMedico(codigo).subscribe({
      next: (response) => {
        if (response.respuesta) {
          const data = response.respuesta;
          // Map DetalleMedicoDTO to RegistroMedicoDTO structure for the form
          this.medico.cedula = data.cedula;
          this.medico.nombre = data.nombre;
          this.medico.correo = data.correo;
          this.medico.telefono = data.telefono;
          this.medico.direccion = data.direccion;
          this.medico.urlFoto = data.urlFoto;
          this.medico.ciudad = data.ciudad;
          this.medico.especialidad = data.especialidad;
          // Note: Password is not returned, leave empty or handle separately

          if (data.ciudad) {
            this.ciudadSeleccionada = data.ciudad.codigo.toString();
          }
          if (data.especialidad) {
            this.especialidadSeleccionada = data.especialidad.codigo.toString();
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar datos del médico';
        this.isLoading = false;
      },
    });
  }

  onCiudadChange(): void {
    const ciudad = this.ciudades.find((c) => c.codigo === parseInt(this.ciudadSeleccionada));
    if (ciudad) {
      this.medico.ciudad = { codigo: ciudad.codigo, nombre: ciudad.nombre };
    }
  }

  onEspecialidadChange(): void {
    const esp = this.especialidades.find(
      (e) => e.codigo === parseInt(this.especialidadSeleccionada)
    );
    if (esp) {
      this.medico.especialidad = { codigo: esp.codigo, nombre: esp.nombre };
    }
  }

  guardarMedico(): void {
    if (this.isEditing) {
      this.actualizarMedico();
    } else {
      this.crearMedico();
    }
  }

  crearMedico(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Ensure required fields are set
    if (!this.medico.horarios) this.medico.horarios = [];
    if (!this.medico.estadoMedico) this.medico.estadoMedico = { codigo: 1, nombre: 'ACTIVO' };

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
      },
    });
  }

  actualizarMedico(): void {
    if (!this.codigoMedico) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create DetalleMedicoDTO from form data
    const detalleDTO = {
      codigo: this.codigoMedico,
      nombre: this.medico.nombre,
      cedula: this.medico.cedula,
      correo: this.medico.correo,
      telefono: this.medico.telefono,
      direccion: this.medico.direccion,
      ciudad: this.medico.ciudad,
      especialidad: this.medico.especialidad,
      urlFoto: this.medico.urlFoto,
      horaInicio: null, // Add time pickers if needed
      horaFin: null,
      horarios: [],
    };

    this.adminService.actualizarMedico(detalleDTO).subscribe({
      next: (response) => {
        this.successMessage = 'Médico actualizado exitosamente';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/medicos']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.respuesta || 'Error al actualizar médico';
        this.isLoading = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/medicos']);
  }
}
