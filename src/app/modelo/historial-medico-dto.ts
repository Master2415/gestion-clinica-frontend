import { Especialidad } from "./especialidad";

export interface HistorialMedicoDTO {
  codigo: number;
  nombreMedico: string;
  especialidad: Especialidad;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  notasMedicas: string;
}
