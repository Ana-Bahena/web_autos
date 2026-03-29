import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface AdminUser {
    id?: number;
    fullName: string;
    email: string;
    role: string;
    password?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly API_URL = `${API_CONFIG.getBaseUrl()}/api/users`;

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<AdminUser[]> {
        return this.http.get<AdminUser[]>(this.API_URL);
    }

    createUser(user: AdminUser): Observable<AdminUser> {
        return this.http.post<AdminUser>(this.API_URL, user);
    }

    updateUser(id: number, user: AdminUser): Observable<AdminUser> {
        return this.http.put<AdminUser>(`${this.API_URL}/${id}`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
