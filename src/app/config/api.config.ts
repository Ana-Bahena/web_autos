/**
 * Configuración global de la API para NovaDrive
 */
export const API_CONFIG = {
    // Cambia el valor a true para usar la API en producción (Railway)
    // o false para usar la API local (localhost:8081)
    useProduction: true,

    // URLs de la API
    developmentUrl: 'http://localhost:8081',
    productionUrl: 'https://webautos-production.up.railway.app',

    /**
     * Obtiene la URL base de la API según el entorno
     */
    getBaseUrl(): string {
        return this.useProduction ? this.productionUrl : this.developmentUrl;
    }
};
