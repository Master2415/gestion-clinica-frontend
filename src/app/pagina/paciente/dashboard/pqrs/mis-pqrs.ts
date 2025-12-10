import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../../../servicios/paciente.service';
import { TokenService } from '../../../../servicios/token';
import { ItemPqrsDTO } from '../../../../modelo/item-pqrs-dto';

@Component({
  selector: 'app-mis-pqrs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-pqrs.html',
  styleUrls: ['./mis-pqrs.css']
})
export class MisPqrs implements OnInit {
  pqrs: ItemPqrsDTO[] = [];
  isLoading = true;
  codigoPaciente = 0;

  constructor(
    private pacienteService: PacienteService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.codigoPaciente = this.tokenService.getCodigo();
    this.loadPqrs();
  }

  loadPqrs(): void {
    this.isLoading = true;
    this.pacienteService.listarPqrsPaciente(this.codigoPaciente).subscribe({
      next: (response: any) => {
        if (response.respuesta) {
          this.pqrs = response.respuesta;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading PQRS:', error);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  verDetalle(codigo: number): void {
    this.router.navigate(['/paciente/mis-pqrs', codigo]);
  }

  getStatusClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'nuevo': return 'status-new';
      case 'en_proceso': return 'status-process';
      case 'resuelto': return 'status-resolved';
      case 'archivado': return 'status-archived';
      default: return '';
    }
  }
}
