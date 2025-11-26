import { Ciudad } from './ciudad';
import { TipoSangre } from './tipo-sangre';

export class RegistroPacienteDTO {
    cedula: string = "";
    nombre: string = "";
    celular: string = "";
    urlFoto: string = "";
    ciudad: Ciudad = new Ciudad();
    fechaNacimiento: string = "";
    alergias: string = "";
    tipoSangre: TipoSangre | null = null;
    correo: string = "";
    contrasena: string = "";
}