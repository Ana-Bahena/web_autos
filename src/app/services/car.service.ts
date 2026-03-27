import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Car {
    id?: number;
    name: string;
    marca: string;
    precio: number;
    ao: number;
    imagen: string;
    categoria: string;
    velocidad?: string;
    aceleracion?: string;
    status: number;
    stock?: number;
}

@Injectable({
    providedIn: 'root'
})
export class CarService {

    private readonly API_URL = 'http://localhost:8081/api/cars';

    // Cache reactivo: cualquier componente puede suscribirse a la lista de autos
    private carsSubject = new BehaviorSubject<Car[]>([]);
    public cars$ = this.carsSubject.asObservable();

    constructor(private http: HttpClient) {}

    // Carga carros del backend y emite el resultado al BehaviorSubject
    loadCars(): void {
        this.http.get<Car[]>(this.API_URL).subscribe({
            next: (data) => this.carsSubject.next(data),
            error: (err) => console.error('Error cargando autos:', err)
        });
    }

    getAllCars(): Observable<Car[]> {
        return this.http.get<Car[]>(this.API_URL);
    }

    getCarById(id: number): Observable<Car> {
        return this.http.get<Car>(`${this.API_URL}/${id}`);
    }

    createCar(car: Car): Observable<Car> {
        return this.http.post<Car>(this.API_URL, car).pipe(
            tap(() => this.loadCars()) // refresca cache global
        );
    }

    updateCar(id: number, car: Car): Observable<Car> {
        return this.http.put<Car>(`${this.API_URL}/${id}`, car).pipe(
            tap(() => this.loadCars()) // refresca cache global
        );
    }

    deleteCar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            tap(() => this.loadCars()) // refresca cache global
        );
    }
}
