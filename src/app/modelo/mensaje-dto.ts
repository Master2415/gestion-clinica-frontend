export class MensajeDTO<T> {
    error: boolean = false;
    respuesta: T | null = null;
}
