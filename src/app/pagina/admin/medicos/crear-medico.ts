import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';
import { ClinicaService } from '../../../servicios/clinica.service';
import { RegistroMedicoDTO } from '../../../modelo/registro-medico-dto';
import { Especialidad } from '../../../modelo/especialidad';
import { Ciudad } from '../../../modelo/ciudad';
import { ImagenService } from '../../../servicios/imagen.service';

@Component({
  selector: 'app-crear-medico',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="crear-medico-page">
      <div class="page-header">
        <h2 class="page-title">{{ isEditing ? 'Editar Médico' : 'Registrar Nuevo Médico' }}</h2>
        <p class="text-muted">Complete la información para {{ isEditing ? 'actualizar los datos del' : 'registrar un nuevo' }} especialista.</p>
      </div>

      <div class="card-form">
        <form (ngSubmit)="guardarMedico()" class="medico-form">
          <div class="form-section">
            <h3 class="section-title"><i class="bi bi-person-vcard-fill"></i> Información Personal</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Cédula <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-card-heading input-icon"></i>
                  <input type="text" [(ngModel)]="medico.cedula" name="cedula" required maxlength="10" placeholder="Ej: 1094857123" />
                </div>
              </div>

              <div class="form-group">
                <label>Nombre Completo <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-person input-icon"></i>
                  <input type="text" [(ngModel)]="medico.nombre" name="nombre" required maxlength="200" placeholder="Ej: Dr. Juan Pérez" />
                </div>
              </div>

              <div class="form-group">
                <label>Correo Electrónico <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-envelope input-icon"></i>
                  <input type="email" [(ngModel)]="medico.correo" name="correo" required maxlength="80" placeholder="correo@clinica.com" />
                </div>
              </div>

              <div class="form-group" *ngIf="!isEditing">
                <label>Contraseña <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-lock input-icon"></i>
                  <input type="password" [(ngModel)]="medico.password" name="password" required maxlength="200" placeholder="********" />
                </div>
              </div>

              <div class="form-group">
                <label>Teléfono <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-telephone input-icon"></i>
                  <input type="tel" [(ngModel)]="medico.telefono" name="telefono" required maxlength="10" placeholder="Ej: 3001234567" />
                </div>
              </div>

              <div class="form-group">
                <label>Dirección <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-geo-alt input-icon"></i>
                  <input type="text" [(ngModel)]="medico.direccion" name="direccion" required maxlength="100" placeholder="Ej: Calle 123 #45-67" />
                </div>
              </div>

              <div class="form-group">
                <label>Foto de Perfil</label>
                <div class="input-wrapper">
                  <i class="bi bi-image input-icon"></i>
                  <input type="file" (change)="onFileSelected($event)" accept="image/*" />
                </div>
                <div *ngIf="medico.urlFoto" class="mt-2">
                  <img [src]="medico.urlFoto" alt="Vista previa" style="max-height: 100px; border-radius: 8px;">
                </div>
              </div>
            </div>
          </div>

          <div class="form-section mt-4">
            <h3 class="section-title"><i class="bi bi-hospital-fill"></i> Información Profesional</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Ciudad <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-building input-icon"></i>
                  <select [(ngModel)]="ciudadSeleccionada" name="ciudad" required (change)="onCiudadChange()">
                    <option value="">Seleccione una ciudad...</option>
                    <option *ngFor="let ciudad of ciudades" [value]="ciudad.codigo">{{ ciudad.nombre }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Especialidad <span class="text-danger">*</span></label>
                <div class="input-wrapper">
                  <i class="bi bi-award input-icon"></i>
                  <select [(ngModel)]="especialidadSeleccionada" name="especialidad" required (change)="onEspecialidadChange()">
                    <option value="">Seleccione una especialidad...</option>
                    <option *ngFor="let esp of especialidades" [value]="esp.codigo">{{ esp.nombre }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section mt-4">
            <h3 class="section-title"><i class="bi bi-clock-fill"></i> Horarios de Atención</h3>
            
            <div class="schedule-list" *ngIf="medico.horarios.length > 0">
              <div class="schedule-item" *ngFor="let horario of medico.horarios; let i = index">
                <div class="schedule-info">
                  <span class="schedule-day">{{ getDiaNombre(horario.dia.codigo) }}</span>
                  <span class="schedule-time">{{ horario.horaInicio }} - {{ horario.horaFin }}</span>
                  <span class="schedule-duration">{{ horario.duracionMinutos }} min/cita</span>
                </div>
                <button type="button" (click)="eliminarHorario(i)" class="btn-remove">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <div class="add-schedule-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Día de la semana</label>
                  <div class="input-wrapper">
                    <i class="bi bi-calendar input-icon"></i>
                    <select [(ngModel)]="nuevoHorario.diaSeleccionado" name="diaHorario">
                      <option value="">Seleccione un día...</option>
                      <option value="1">Lunes</option>
                      <option value="2">Martes</option>
                      <option value="3">Miércoles</option>
                      <option value="4">Jueves</option>
                      <option value="5">Viernes</option>
                      <option value="6">Sábado</option>
                      <option value="7">Domingo</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Hora inicio</label>
                  <div class="input-wrapper">
                    <i class="bi bi-clock input-icon"></i>
                    <input type="time" [(ngModel)]="nuevoHorario.horaInicio" name="horaInicio" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Hora fin</label>
                  <div class="input-wrapper">
                    <i class="bi bi-clock input-icon"></i>
                    <input type="time" [(ngModel)]="nuevoHorario.horaFin" name="horaFin" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Duración por cita (minutos)</label>
                  <div class="input-wrapper">
                    <i class="bi bi-hourglass-split input-icon"></i>
                    <input type="number" [(ngModel)]="nuevoHorario.duracionMinutos" name="duracionMinutos" 
                           min="10" max="120" step="5" placeholder="20" />
                  </div>
                </div>
              </div>

              <button type="button" (click)="agregarHorario()" class="btn-add-schedule">
                <i class="bi bi-plus-circle"></i> Agregar Horario
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" (click)="cancelar()" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" [disabled]="isLoading" class="btn-primary">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isLoading ? 'Guardando...' : isEditing ? 'Actualizar Médico' : 'Registrar Médico' }}
            </button>
          </div>

          <div *ngIf="errorMessage" class="alert alert-danger mt-3">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
          </div>
          <div *ngIf="successMessage" class="alert alert-success mt-3">
            <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .crear-medico-page {
        max-width: 900px;
        margin: 0 auto;
      }
      .page-header {
        margin-bottom: 2rem;
        text-align: center;
      }
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }
      .card-form {
        background: white;
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(0,0,0,0.05);
      }
      .form-section {
        margin-bottom: 2rem;
      }
      .section-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary-blue);
        border-bottom: 2px solid var(--neutral-light);
        padding-bottom: 0.75rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
      }
      .form-group {
        margin-bottom: 0.5rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-secondary);
        font-size: 0.95rem;
      }
      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }
      .input-icon {
        position: absolute;
        left: 1rem;
        color: var(--text-muted);
        font-size: 1.1rem;
        pointer-events: none;
      }
      input, select {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        border: 1px solid var(--neutral-medium);
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #F8FAFC;
        color: var(--text-primary);
      }
      input:focus, select:focus {
        outline: none;
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        background: white;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--neutral-light);
      }
      .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: 1rem;
      }
      .btn-primary {
        background: var(--gradient-primary);
        color: white;
        box-shadow: var(--shadow-md);
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
      .btn-primary:disabled {
        background: var(--neutral-medium);
        transform: none;
        box-shadow: none;
      }
      .btn-secondary {
        background: white;
        border: 1px solid var(--neutral-medium);
        color: var(--text-secondary);
      }
      .btn-secondary:hover {
        background: var(--neutral-light);
        color: var(--text-primary);
      }
      .alert {
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
      }
      .alert-danger {
        background: #FEF2F2;
        color: #EF4444;
        border: 1px solid #FEE2E2;
      }
      .alert-success {
        background: #F0FDF4;
        color: #16A34A;
        border: 1px solid #DCFCE7;
      }
      .text-danger { color: #EF4444; }
      
      /* Schedule Management Styles */
      .schedule-list {
        margin-bottom: 1.5rem;
      }
      .schedule-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #F8FAFC;
        border: 1px solid var(--neutral-medium);
        border-radius: 8px;
        margin-bottom: 0.75rem;
      }
      .schedule-info {
        display: flex;
        gap: 1.5rem;
        align-items: center;
      }
      .schedule-day {
        font-weight: 600;
        color: var(--primary-blue);
        min-width: 100px;
      }
      .schedule-time {
        color: var(--text-secondary);
      }
      .schedule-duration {
        color: var(--text-muted);
        font-size: 0.9rem;
      }
      .btn-remove {
        background: #FEE2E2;
        color: #EF4444;
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-remove:hover {
        background: #FEF2F2;
        transform: scale(1.05);
      }
      .add-schedule-form {
        background: #F8FAFC;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px dashed var(--neutral-medium);
      }
      .btn-add-schedule {
        background: var(--gradient-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 1rem;
        transition: all 0.3s;
      }
      .btn-add-schedule:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
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
  
  // Schedule management
  nuevoHorario = {
    diaSeleccionado: '',
    horaInicio: '',
    horaFin: '',
    duracionMinutos: 20
  };
  
  diasSemana = [
    { codigo: 1, nombre: 'Lunes' },
    { codigo: 2, nombre: 'Martes' },
    { codigo: 3, nombre: 'Miércoles' },
    { codigo: 4, nombre: 'Jueves' },
    { codigo: 5, nombre: 'Viernes' },
    { codigo: 6, nombre: 'Sábado' },
    { codigo: 7, nombre: 'Domingo' }
  ];

  constructor(
    private adminService: AdministradorService,
    private clinicaService: ClinicaService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private imagenService: ImagenService
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
          this.medico.horarios = data.horarios || [];
          
          // Set selected values for dropdowns
          this.ciudadSeleccionada = data.ciudad?.codigo?.toString() || '';
          this.especialidadSeleccionada = data.especialidad?.codigo?.toString() || '';
          
          // Trigger change detection to update UI
          this.cd.detectChanges();
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

    // Frontend validation for length constraints
    if (this.medico.cedula.length > 10) {
      this.errorMessage = 'La cédula no puede tener más de 10 caracteres';
      this.isLoading = false;
      return;
    }
    if (this.medico.telefono.length > 10) {
      this.errorMessage = 'El teléfono no puede tener más de 10 caracteres';
      this.isLoading = false;
      return;
    }

    // Ensure required fields are set
    if (!this.medico.horarios) this.medico.horarios = [];
    if (!this.medico.estadoMedico) this.medico.estadoMedico = { codigo: 1, nombre: 'ACTIVO' };

    console.log('Datos del médico a enviar:', JSON.stringify(this.medico, null, 2));

    this.adminService.crearMedico(this.medico).subscribe({
      next: (response) => {
        this.successMessage = 'Médico creado exitosamente';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/medicos']);
        }, 1500);
      },
      error: (error) => {
        if (error.error && error.error.respuesta) {
          const respuesta = error.error.respuesta;
          if (typeof respuesta === 'object') {
            this.errorMessage = Object.values(respuesta).join(', ');
          } else {
            this.errorMessage = respuesta;
          }
        } else {
          this.errorMessage = 'Error al crear médico';
        }
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
      horarios: this.medico.horarios
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
        if (error.error && error.error.respuesta) {
          const respuesta = error.error.respuesta;
          if (typeof respuesta === 'object') {
            this.errorMessage = Object.values(respuesta).join(', ');
          } else {
            this.errorMessage = respuesta;
          }
        } else {
          this.errorMessage = 'Error al actualizar médico';
        }
        this.isLoading = false;
      },
    });
  }

  agregarHorario(): void {
    if (!this.nuevoHorario.diaSeleccionado || !this.nuevoHorario.horaInicio || 
        !this.nuevoHorario.horaFin || !this.nuevoHorario.duracionMinutos) {
      this.errorMessage = 'Por favor complete todos los campos del horario';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (this.nuevoHorario.horaInicio >= this.nuevoHorario.horaFin) {
      this.errorMessage = 'La hora de inicio debe ser menor que la hora de fin';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    // Check if schedule for this day already exists
    const diaExiste = this.medico.horarios.some(h => h.dia.codigo === parseInt(this.nuevoHorario.diaSeleccionado));
    if (diaExiste) {
      this.errorMessage = 'Ya existe un horario para este día';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const dia = this.diasSemana.find(d => d.codigo === parseInt(this.nuevoHorario.diaSeleccionado));
    if (dia) {
      this.medico.horarios.push({
        dia: { codigo: dia.codigo, nombre: dia.nombre },
        horaInicio: this.nuevoHorario.horaInicio,
        horaFin: this.nuevoHorario.horaFin,
        duracionMinutos: this.nuevoHorario.duracionMinutos
      });
      
      // Reset form
      this.resetNuevoHorario();
      this.successMessage = 'Horario agregado exitosamente';
      setTimeout(() => this.successMessage = '', 2000);
    }
  }

  eliminarHorario(index: number): void {
    this.medico.horarios.splice(index, 1);
  }

  getDiaNombre(codigoDia: number): string {
    const dia = this.diasSemana.find(d => d.codigo === codigoDia);
    return dia ? dia.nombre : '';
  }

  resetNuevoHorario(): void {
    this.nuevoHorario = {
      diaSeleccionado: '',
      horaInicio: '',
      horaFin: '',
      duracionMinutos: 20
    };
  }

  cancelar(): void {
    this.router.navigate(['/admin/medicos']);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.imagenService.subir(file).subscribe({
        next: (response) => {
          if (response.respuesta) {
            this.medico.urlFoto = response.respuesta.url;
            this.successMessage = 'Imagen subida exitosamente';
            setTimeout(() => this.successMessage = '', 2000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al subir la imagen';
          this.isLoading = false;
        }
      });
    }
  }
}
