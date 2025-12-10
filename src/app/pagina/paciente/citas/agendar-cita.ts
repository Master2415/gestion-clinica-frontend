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
        this.successMessage = 'Cita agendada exitosamente';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/paciente/mis-citas']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.respuesta || 'Error al agendar la cita';
        this.isLoading = false;
      }
    });
  }
}
