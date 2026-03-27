import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de Autenticación:
 * Protege cualquier ruta para que solo usuarios logueados puedan entrar.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    } else {
        // Redirigir al inicio para que el usuario inicie sesión
        router.navigate(['/']);
        return false;
    }
};
