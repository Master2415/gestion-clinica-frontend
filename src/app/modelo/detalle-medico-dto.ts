export class DetalleMedicoDTO {
    codigo: number = 0;
    cedula: string = '';
    nombre: string = '';
    correo: string = '';
    telefono: string = '';
    direccion: string = '';
    urlFoto: string = '';
    ciudad: { codigo: number; nombre: string } = { codigo: 0, nombre: '' };
    especialidad: { codigo: number; nombre: string } = { codigo: 0, nombre: '' };
}
