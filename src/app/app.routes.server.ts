import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Landing page - se puede prerender
    path: '',
    renderMode: RenderMode.Server
  },
  {
    // Dashboard - renderizado en servidor (requiere auth, no se puede prerender)
    path: 'dashboard',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
