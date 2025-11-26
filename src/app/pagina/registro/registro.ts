import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Auth } from '../../servicios/auth';
import { RegistroPacienteDTO } from '../../modelo/registro-paciente-dto';
import { ClinicaService } from '../../servicios/clinica.service';
import { Ciudad } from '../../modelo/ciudad';
import { TipoSangre } from '../../modelo/tipo-sangre';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {

  paciente: RegistroPacienteDTO = new RegistroPacienteDTO();
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  ciudades: Ciudad[] = [];
  tiposSangre: TipoSangre[] = [];

  constructor(
    private authService: Auth,
    private clinicaService: ClinicaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDatosParalelo();
  }

  // Carga paralela de ciudades y tipos de sangre para mejorar el rendimiento
  cargarDatosParalelo(): void {
    forkJoin({
      ciudades: this.clinicaService.listarCiudades(),
      tiposSangre: this.clinicaService.listarTiposSangre()
    }).subscribe({
      next: (response) => {
        if (response.ciudades.respuesta) {
          this.ciudades = response.ciudades.respuesta;
          console.log('Ciudades cargadas:', this.ciudades.length);
        }
        if (response.tiposSangre.respuesta) {
          this.tiposSangre = response.tiposSangre.respuesta;
          console.log('Tipos de sangre cargados:', this.tiposSangre.length);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.errorMessage = 'Error al cargar los datos del formulario. Por favor, recargue la página.';
      }
    });
  }

  onCiudadChange(event: any): void {
    const codigo = parseInt(event.target.value);
    const ciudadSeleccionada = this.ciudades.find(c => c.codigo === codigo);

    if (ciudadSeleccionada) {
      this.paciente.ciudad = ciudadSeleccionada;
    } else {
      this.paciente.ciudad = new Ciudad();
    }
  }

  onTipoSangreChange(event: any): void {
    const codigo = parseInt(event.target.value);
    const tipoSeleccionado = this.tiposSangre.find(t => t.codigo === codigo);

    if (tipoSeleccionado) {
      this.paciente.tipoSangre = tipoSeleccionado;
    } else {
      this.paciente.tipoSangre = null;
    }
  }

  registrar(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validación básica
    if (!this.paciente.cedula || !this.paciente.nombre || !this.paciente.correo || !this.paciente.contrasena || !this.paciente.celular || !this.paciente.urlFoto || !this.paciente.alergias || !this.paciente.fechaNacimiento || this.paciente.ciudad.codigo === 0) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios';
      return;
    }

    // Validaciones manuales adicionales
    if (!this.paciente.ciudad || this.paciente.ciudad.codigo === 0) {
      this.errorMessage = "Debe seleccionar una ciudad";
      return;
    }

    if (this.paciente.tipoSangre && this.paciente.tipoSangre.codigo === 0) {
      this.paciente.tipoSangre = null; // Enviar null si es la opción por defecto
    }

    this.isLoading = true;

    console.log('Enviando datos de paciente:', JSON.stringify(this.paciente));

    this.authService.registrarse(this.paciente).subscribe({
      next: (response) => {
        this.successMessage = response.respuesta || 'Registro exitoso. Redirigiendo al login...';
        this.isLoading = false;

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error de registro completo:', error);
        console.error('Detalles del error (body):', error.error);

        // Intentar extraer el mensaje de error específico si viene del backend
        let mensajeError = 'Error al registrar el paciente. Intente nuevamente.';
        if (error.error && error.error.respuesta) {
          mensajeError = error.error.respuesta;
        } else if (error.error && typeof error.error === 'string') {
          mensajeError = error.error;
        }

        this.errorMessage = mensajeError;
        this.isLoading = false;
      }
    });
  }
}
