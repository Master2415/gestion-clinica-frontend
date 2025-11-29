import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../../servicios/paciente.service';
import { TokenService } from '../../../servicios/token';
import { CrearPqrsDTO } from '../../../modelo/crear-pqrs-dto';
import { CitaPacienteDTO } from '../../../modelo/cita-paciente-dto';

@Component({
  selector: 'app-crear-pqrs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-pqrs.html',
  styleUrls: ['./crear-pqrs.css']
})
export class CrearPqrs implements OnInit {
  crearPqrsDTO: CrearPqrsDTO = {
    codigoCita: 0,
    motivo: '',
    descripcion: '',
    tipoPqrs: '',
    codigoPaciente: 0
  };

  citas: CitaPacienteDTO[] = [];
  tiposPqrs: string[] = ['PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA'];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private pacienteService: PacienteService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearPqrsDTO.codigoPaciente = this.tokenService.getCodigo();
    this.loadCitas();
  }

  loadCitas(): void {
    this.pacienteService.listarCitasPaciente(this.crearPqrsDTO.codigoPaciente).subscribe({
      next: (response) => {
        if (response.respuesta) {
          this.citas = response.respuesta;
        }
      },
      error: (error) => console.error('Error loading appointments:', error)
    });
  }

  crear(): void {
    if (!this.crearPqrsDTO.codigoCita || !this.crearPqrsDTO.motivo || !this.crearPqrsDTO.tipoPqrs) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.pacienteService.crearPqrs(this.crearPqrsDTO).subscribe({
      next: (response) => {
        this.successMessage = 'PQRS creada exitosamente';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/paciente/mis-pqrs']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.respuesta || 'Error al crear la PQRS';
        this.isLoading = false;
      }
    });
  }
}
