import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    fullName?: string;
    email?: string;
    role?: string;
    userId?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
    captchaToken: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserSession {
    token: string;
    fullName: string;
    email: string;
    role: string;
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly API_URL = 'http://localhost:8081/api/auth';
    private readonly SESSION_KEY = 'novadrive_session';
    private readonly PURCHASED_CARS_KEY = 'novadrive_purchased_cars';

    constructor(private http: HttpClient) { }

    // ── HTTP Calls ────────────────────────────────────────────────────────────

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request);
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, request);
    }

    // ── Session Management (SSR-safe) ─────────────────────────────────────────

    saveSession(response: AuthResponse): void {
        if (typeof localStorage === 'undefined') return;
        const session: UserSession = {
            token: response.token!,
            fullName: response.fullName!,
            email: response.email!,
            role: response.role!,
            id: response.userId!
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    getSession(): UserSession | null {
        if (typeof localStorage === 'undefined') return null;
        const data = localStorage.getItem(this.SESSION_KEY);
        return data ? JSON.parse(data) : null;
    }

    isLoggedIn(): boolean {
        return this.getSession() !== null;
    }

    logout(): void {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(this.SESSION_KEY);
    }

    getCurrentUser(): UserSession | null {
        return this.getSession();
    }

    // ── Purchased Cars Management ───────────────────────────────────────────

    getPurchasedCars(): any[] {
        if (typeof localStorage === 'undefined') return [];
        const data = localStorage.getItem(this.PURCHASED_CARS_KEY);
        return data ? JSON.parse(data) : [];
    }

    addPurchasedCars(cars: any[]): void {
        const current = this.getPurchasedCars();
        const updated = [...current, ...cars];
        localStorage.setItem(this.PURCHASED_CARS_KEY, JSON.stringify(updated));
    }
}
