import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../servicios/token';

export const authGuard = () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (tokenService.getToken()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};
