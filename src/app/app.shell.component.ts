import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Shell component - Solo contiene el router-outlet.
 * El routing decide qué componente mostrar:
 *  - '/' → HomeComponent (landing page)
 *  - '/dashboard' → DashboardComponent
 */
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`
})
export class AppShellComponent { }
