export class RegistroMedicoDTO {
    cedula: string = '';
    nombre: string = '';
    correo: string = '';
    contrasena: string = '';
    telefono: string = '';
    urlFoto: string = '';
    ciudad: { codigo: number; nombre: string } = { codigo: 0, nombre: '' };
    especialidad: { codigo: number; nombre: string } = { codigo: 0, nombre: '' };
}
