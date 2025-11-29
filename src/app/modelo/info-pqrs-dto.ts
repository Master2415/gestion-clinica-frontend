import { Especialidad } from "./especialidad";
import { EstadoPqrs } from "./estado-pqrs";

export class InfoPQRSDTO {
    codigo: number = 0;
    estado!: EstadoPqrs;
    motivo: string = '';
    nombrePaciente: string = '';
    nombreMedico: string = '';
    especializacion!: Especialidad;
    fecha: string = '';
    mensajes: any[] = [];
}
