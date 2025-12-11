import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoService } from '../../../servicios/medico.service';
import { TokenService } from '../../../servicios/token';
import { RegistroAtencionDTO } from '../../../modelo/registro-atencion-dto';

@Component({
    selector: 'app-atender-cita',
    imports: [CommonModule, FormsModule],
    templateUrl: './atender-cita.html',
    styleUrl: './atender-cita.css',
})
export class AtenderCita implements OnInit {
    registro: RegistroAtencionDTO = new RegistroAtencionDTO();
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private medicoService: MedicoService,
        private tokenService: TokenService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const codigoCita = this.route.snapshot.params['codigo'];
        if (codigoCita) {
            this.registro.codigoCita = +codigoCita;
        }
        // Set the doctor's code from the token
        this.registro.codigoMedico = this.tokenService.getCodigo();
    }

    atenderCita(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.medicoService.atenderCita(this.registro).subscribe({
            next: (response) => {
                this.successMessage = 'Cita atendida exitosamente';
                this.isLoading = false;
                setTimeout(() => {
                    this.router.navigate(['/medico/citas-pendientes']);
                }, 1500);
            },
            error: (error) => {
                this.isLoading = false;
                const errorMsg = error.error?.respuesta || 'Error al atender cita';
                
                // Verificar si el error es por fecha futura
                if (errorMsg.includes('aún no ha llegado la fecha')) {
                    // Extraer la fecha del mensaje de error
                    const fechaMatch = errorMsg.match(/fecha: (.+)/);
                    const fechaCita = fechaMatch ? fechaMatch[1] : 'la fecha programada';
                    
                    // Mostrar confirmación
                    const confirmar = confirm(
                        `Esta cita está programada para ${fechaCita}.\n\n` +
                        `¿Desea atenderla de todos modos?`
                    );
                    
                    if (confirmar) {
                        // Reintentar con flag de forzar atención
                        this.registro.forzarAtencion = true;
                        this.atenderCita();
                    }
                } else {
                    this.errorMessage = errorMsg;
                }
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/medico/citas-pendientes']);
    }
}
