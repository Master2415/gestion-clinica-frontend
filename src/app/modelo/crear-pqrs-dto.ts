export interface CrearPqrsDTO {
  codigoPaciente: number;
  codigoCita: number;
  motivo: string;
  descripcion: string;
  tipoPqrs: string; // 'PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA'
}
