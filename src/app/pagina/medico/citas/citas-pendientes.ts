import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MedicoService } from '../../../servicios/medico.service';
import { TokenService } from '../../../servicios/token';
import { ConsultaDTO } from '../../../modelo/consulta-dto';

@Component({
    selector: 'app-citas-pendientes',
    imports: [CommonModule, RouterLink],
    templateUrl: './citas-pendientes.html',
    styleUrl: './citas-pendientes.css',
})
export class CitasPendientes implements OnInit {
    citas: ConsultaDTO[] = [];
    isLoading = true;
    errorMessage = '';
    codigoMedico = 0;

    constructor(
        private medicoService: MedicoService,
        private tokenService: TokenService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.codigoMedico = this.tokenService.getCodigo();
        this.loadCitas();
    }

    loadCitas(): void {
        this.isLoading = true;
        this.medicoService.listarCitasPendientes(this.codigoMedico).subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.citas = response.respuesta;
                }
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (error) => {
                this.errorMessage = 'Error al cargar citas pendientes';
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }
}
