import { HorarioDTO } from './horario-dto';

export class RegistroMedicoDTO {
    cedula: string = '';
    nombre: string = '';
    correo: string = '';
    telefono: string = '';
    direccion: string = '';
    urlFoto: string = '';
    ciudad: { codigo: number; nombre: string } = { codigo: 0, nombre: '' };
    especialidad: { codigo: number; nombre: string } = { codigo: 0, nombre: '' };
    horarios: HorarioDTO[] = [];
    estadoMedico: { codigo: number; nombre: string } = { codigo: 1, nombre: 'ACTIVO' };
    password: string = '';
}
