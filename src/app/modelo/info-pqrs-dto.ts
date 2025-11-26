export class InfoPQRSDTO {
    codigo: number = 0;
    motivo: string = '';
    mensaje: string = '';
    fechaCreacion: string = '';
    estado: string = '';
    nombrePaciente: string = '';
    respuestas: Array<{
        cuenta: string;
        mensaje: string;
        fecha: string;
    }> = [];
}
