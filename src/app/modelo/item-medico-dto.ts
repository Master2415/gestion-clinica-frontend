import { Especialidad } from "./especialidad";

export class ItemMedicoDTO {
    codigo: number = 0;
    cedula: string = '';
    nombre: string = '';
    especialidad!: Especialidad;
    telefono: string = '';
    correo: string = '';
    urlFoto: string = '';
}
