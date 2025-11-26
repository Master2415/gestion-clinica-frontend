import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministradorService } from '../../../servicios/administrador.service';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

    totalMedicos = 0;
    totalPqrs = 0;
    totalCitas = 0;
    isLoading = true;

    constructor(private adminService: AdministradorService) { }

    ngOnInit(): void {
        this.loadStatistics();
    }

    loadStatistics(): void {
        this.adminService.listarMedicos().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.totalMedicos = response.respuesta.length;
                }
            }
        });

        this.adminService.listarPQRS().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.totalPqrs = response.respuesta.length;
                }
            }
        });

        this.adminService.listarCitas().subscribe({
            next: (response) => {
                if (response.respuesta) {
                    this.totalCitas = response.respuesta.length;
                }
                this.isLoading = false;
            }
        });
    }
}
