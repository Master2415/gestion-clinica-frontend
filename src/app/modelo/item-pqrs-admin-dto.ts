import { EstadoPqrs } from "./estado-pqrs";

export class ItemPqrsAdminDTO {
    codigo: number = 0;
    estadoPqrs!: EstadoPqrs;
    fecha: string = '';
    nombrePaciente: string = '';
    motivo: string = '';
}
