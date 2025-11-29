import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoService } from '../../../servicios/medico.service';
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
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const codigoCita = this.route.snapshot.params['codigo'];
        if (codigoCita) {
            this.registro.codigoCita = +codigoCita;
        }
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
                this.errorMessage = error.error?.respuesta || 'Error al atender cita';
                this.isLoading = false;
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/medico/citas-pendientes']);
    }
}
