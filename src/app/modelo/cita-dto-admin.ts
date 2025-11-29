import { Especialidad } from "./especialidad";
import { EstadoCita } from "./estado-cita";

export class CitaDTOAdmin {
    codigoCita: number = 0;
    cedulaPaciente: string = '';
    nombrePaciente: string = '';
    nombreMedico: string = '';
    fecha: string = '';
    especializacion!: Especialidad;
    estadoCita!: EstadoCita;
    motivo: string = '';
}
