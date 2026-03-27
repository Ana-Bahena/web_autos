import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        title: 'NovaDrive - Autos Deportivos Premium'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        title: 'Mi Panel - NovaDrive'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
