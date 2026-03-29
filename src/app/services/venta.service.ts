import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Car } from './car.service';

export interface Venta {
    id?: number;
    user: any;
    car: Car;
    precioTotal: number;
    status: number;
    fechaVenta?: string;
}

export interface VentaRequest {
    userId: number;
    carId: number;
}

@Injectable({
    providedIn: 'root'
})
export class VentaService {

    private readonly API_URL = `${API_CONFIG.getBaseUrl()}/api/ventas`;

    constructor(private http: HttpClient) { }

    getAllSales(): Observable<Venta[]> {
        return this.http.get<Venta[]>(this.API_URL);
    }

    getSalesByUser(email: string): Observable<Venta[]> {
        return this.http.get<Venta[]>(`${this.API_URL}/user/${email}`);
    }

    createSale(request: VentaRequest): Observable<Venta> {
        return this.http.post<Venta>(this.API_URL, request);
    }

    deleteSale(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
