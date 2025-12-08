export interface EstadoCita {
  codigo: number;
  estado: string;
}

export interface CitaPacienteDTO {
  codigo: number;
  nombreMedico: string;
  especialidad: string;
  motivo: string;
  fechaCita: string;
  fechaCreacion: string;
  estadoCita: EstadoCita;
}
