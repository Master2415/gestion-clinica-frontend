export class RegistroAtencionDTO {
    codigoCita: number = 0;
    codigoMedico: number = 0;
    sintomas: string = '';
    diagnostico: string = '';
    tratamiento: string = '';
    notasMedicas: string = '';
    medicamentos: any[] = [];
    descripcionReceta: string = '';
    forzarAtencion?: boolean; // Flag para permitir atender antes de la fecha programada
}
