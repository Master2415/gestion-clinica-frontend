import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MedicoService } from '../../../servicios/medico.service';
import { TokenService } from '../../../servicios/token';

@Component({
    selector: 'app-medico-dashboard',
    imports: [CommonModule, RouterLink],
    templateUrl: './medico-dashboard.html',
    styleUrl: './medico-dashboard.css',
})
export class MedicoDashboard implements OnInit {
    totalPendientes = 0;
    totalRealizadas = 0;
    isLoading = true;
    codigoMedico = 0;
    userName = '';

    constructor(
        private medicoService: MedicoService,
        private tokenService: TokenService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.codigoMedico = this.tokenService.getCodigo();
        this.userName = this.tokenService.getNombre();
        this.loadStatistics();
    }

    loadStatistics(): void {
        this.medicoService.listarCitasPendientes(this.codigoMedico).subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.totalPendientes = response.respuesta.length;
                }
                this.cd.detectChanges();
            },
            error: (err) => console.error('Error loading pending appointments', err)
        });

        this.medicoService.listarCitasRealizadas(this.codigoMedico).subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.totalRealizadas = response.respuesta.length;
                }
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (err) => {
                console.error('Error loading completed appointments', err);
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }
}
