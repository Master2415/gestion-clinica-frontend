import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../../servicios/paciente.service';
import { TokenService } from '../../../servicios/token';
import { AgendarCitaDTO } from '../../../modelo/agendar-cita-dto';
import { ItemMedicoDTO } from '../../../modelo/item-medico-dto';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-cita.html',
  styleUrls: ['./agendar-cita.css']
})
export class AgendarCita implements OnInit {
  agendarCitaDTO: AgendarCitaDTO = {
    codigoPaciente: 0,
    codigoMedico: 0,
    motivo: '',
    fecha: ''
  };
  
  medicos: ItemMedicoDTO[] = [];
  especialidades: string[] = [];
  selectedEspecialidad = '';
  medicosFiltrados: ItemMedicoDTO[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  // Available slots
  fechaSeleccionada = '';
  horariosDisponibles: any[] = [];
  isLoadingSlots = false;
  medicoSeleccionado: any = null;
  diasAtencion: string[] = [];

  constructor(
    private pacienteService: PacienteService,
    private tokenService: TokenService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.agendarCitaDTO.codigoPaciente = this.tokenService.getCodigo();
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.pacienteService.listarMedicosDisponibles().subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.medicos = response.respuesta;
          // Map especialidad object to its name (string)
          this.especialidades = [...new Set(this.medicos.map(m => m.especialidad.nombre))];
          this.filterMedicos();
        }
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.cd.detectChanges();
      }
    });
  }

  filterMedicos(): void {
    if (this.selectedEspecialidad) {
      this.medicosFiltrados = this.medicos.filter(m => m.especialidad.nombre === this.selectedEspecialidad);
    } else {
      this.medicosFiltrados = this.medicos;
    }
  }

  agendar(): void {
    if (!this.agendarCitaDTO.codigoMedico || !this.agendarCitaDTO.fecha || !this.agendarCitaDTO.motivo) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.pacienteService.agendarCita(this.agendarCitaDTO).subscribe({
      next: (response) => {
        console.log('Cita agendada exitosamente:', response);
        this.successMessage = 'Cita agendada exitosamente';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/paciente/mis-citas']), 2000);
      },
      error: (error) => {
        console.error('Error al agendar cita:', error);
        // Mejorar el manejo de errores
        if (error.error && typeof error.error === 'object') {
          this.errorMessage = error.error.respuesta || error.error.message || 'Error al agendar la cita';
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Error al agendar la cita';
        }
        this.isLoading = false;
      }
    });
  }

  cargarHorariosDisponibles(): void {
    if (!this.agendarCitaDTO.codigoMedico || !this.fechaSeleccionada) {
      return;
    }

    this.isLoadingSlots = true;
    this.horariosDisponibles = [];
    this.agendarCitaDTO.fecha = ''; // Reset selected slot

    this.pacienteService.obtenerHorariosDisponibles(this.agendarCitaDTO.codigoMedico, this.fechaSeleccionada).subscribe({
      next: (response) => {
        this.horariosDisponibles = response.respuesta || [];
        this.isLoadingSlots = false;
      },
      error: (error) => {
        console.error('Error cargando horarios:', error);
        this.horariosDisponibles = [];
        this.isLoadingSlots = false;
      }
    });
  }

  onMedicoChange(): void {
    // Reset when changing doctor
    this.fechaSeleccionada = '';
    this.horariosDisponibles = [];
    this.agendarCitaDTO.fecha = '';
    
    // Load doctor schedule info
    this.medicoSeleccionado = this.medicosFiltrados.find(m => m.codigo === this.agendarCitaDTO.codigoMedico);
    
    // Get working days from backend
    if (this.medicoSeleccionado && this.medicoSeleccionado.diasAtencion && this.medicoSeleccionado.diasAtencion.length > 0) {
      this.diasAtencion = this.medicoSeleccionado.diasAtencion;
    } else {
      this.diasAtencion = ['No hay días registrados'];
    }
  }

  seleccionarHorario(slot: any): void {
    this.agendarCitaDTO.fecha = slot.fechaHora;
  }

  formatearHora(fechaHora: string): string {
    const date = new Date(fechaHora);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}
