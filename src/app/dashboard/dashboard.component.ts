import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserSession } from '../services/auth.service';
import { Car, CarService } from '../services/car.service';
import { AdminUser, UserService } from '../services/user.service';
import { Venta, VentaService } from '../services/venta.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    user: UserSession | null = null;
    currentTime = new Date();
    activeSection = 'profile'; 
    purchasedCars: Car[] = [];

    // --- ADMIN CRUD DATOS ---
    adminUsers: AdminUser[] = [];
    adminProducts: Car[] = [];
    adminSales: Venta[] = [];

    // Formularios vacíos para CRUD
    newUser: AdminUser = { fullName: '', email: '', role: 'USER', password: '' };
    newProduct: Car = { id: 0, name: '', marca: '', precio: 0, ao: 2024, imagen: '', categoria: 'Sports', status: 1, stock: 1, velocidad: '', aceleracion: '' };

    isEditingUser = false;
    isEditingProduct = false;

    // Modal de edición de producto
    showEditModal = false;
    isUpdatingProduct = false;
    updateSuccess = false; // Nuevo estado para mostrar "Cambios realizados"
    isSavingProduct = false;
    productFormError = '';
    editingProduct: Car = { id: 0, name: '', marca: '', precio: 0, ao: 2024, imagen: '', categoria: 'Sports', status: 1, stock: 1, velocidad: '', aceleracion: '' };

    // Toast de éxito
    toastMessage: string | null = null;
    private toastTimeout: any;

    showToast(msg: string) {
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastMessage = msg;
        this.toastTimeout = setTimeout(() => this.toastMessage = null, 4000);
    }

    // Filtro del catálogo admin
    catalogFilter = 'all';

    recentActivity = [
        { icon: '🔍', text: 'Buscaste "Lamborghini SVJ"', time: 'Hace 5 min' },
        { icon: '❤️', text: 'Guardaste "Bugatti" en favoritos', time: 'Hace 20 min' },
        { icon: '📞', text: 'Solicitaste información de "BMW"', time: 'Hace 2 hrs' },
        { icon: '✅', text: 'Cuenta creada exitosamente', time: 'Hoy' }
    ];

    stats = [
        { label: 'Autos Vistos', value: '12', icon: '👁️', color: 'blue' },
        { label: 'Favoritos', value: '3', icon: '❤️', color: 'red' },
        { label: 'Cotizaciones', value: '2', icon: '📋', color: 'green' },
        { label: 'Mensajes', value: '1', icon: '💬', color: 'purple' }
    ];

    constructor(
        private authService: AuthService,
        private carService: CarService,
        private userService: UserService,
        private ventaService: VentaService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.user = this.authService.getSession();
        if (!this.user) {
            this.router.navigate(['/']);
        } else {
            this.activeSection = this.user.role === 'ADMIN' ? 'users' : 'cars';
            if (this.user.role === 'ADMIN') {
                this.loadAdminProducts();
                this.loadUsers();
                this.loadAllSales();
            } else {
                this.loadUserPurchases();
            }
        }

        setInterval(() => this.currentTime = new Date(), 60000);
    }

    get filteredAdminCatalog(): Car[] {
        if (this.catalogFilter === 'all') return this.adminProducts;
        return this.adminProducts.filter(c => c.categoria === this.catalogFilter);
    }

    loadUsers(): void {
        this.userService.getAllUsers().subscribe({
            next: (data) => this.adminUsers = data,
            error: (err) => console.error('Error al cargar usuarios:', err)
        });
    }

    loadAllSales(): void {
        this.ventaService.getAllSales().subscribe({
            next: (data) => this.adminSales = data,
            error: (err) => console.error('Error al cargar ventas:', err)
        });
    }

    loadUserPurchases(): void {
        if (!this.user) return;
        this.ventaService.getSalesByUser(this.user.email).subscribe({
            next: (sales) => {
                this.purchasedCars = sales.map(s => s.car);
            },
            error: (err) => console.error('Error cargando compras:', err)
        });
    }

    loadAdminProducts(): void {
        this.carService.loadCars();
        this.carService.getAllCars().subscribe({
            next: (data) => this.adminProducts = data,
            error: (err) => console.error('Error al cargar autos:', err)
        });
    }

    get greeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    }

    get firstName(): string {
        return this.user?.fullName?.split(' ')[0] || 'Usuario';
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    goHome(): void {
        this.router.navigate(['/']);
    }

    setSection(section: string): void {
        this.activeSection = section;
    }

    // --- MÉTODOS CRUD USUARIOS ---
    editUser(u: AdminUser) { 
        this.isEditingUser = true; 
        this.newUser = { ...u, password: '' }; 
    }
    
    deleteUser(id: number | undefined) { 
        if (!id) return;
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
            this.userService.deleteUser(id).subscribe({
                next: () => {
                    this.loadUsers();
                    this.showToast('🗑️ Usuario eliminado correctamente');
                },
                error: (err) => alert('Error eliminando: ' + err.message)
            });
        }
    }

    saveUser() {
        if (!this.newUser.fullName || !this.newUser.email) {
            alert('Nombre y Email son requeridos');
            return;
        }

        if (this.isEditingUser && this.newUser.id) {
            this.userService.updateUser(this.newUser.id, this.newUser).subscribe({
                next: () => {
                    this.loadUsers();
                    this.showToast('✅ Usuario actualizado');
                    this.resetUserForm();
                },
                error: (err) => alert('Error actualizando: ' + err.message)
            });
        } else {
            this.userService.createUser(this.newUser).subscribe({
                next: () => {
                    this.loadUsers();
                    this.showToast('✨ Nuevo usuario creado');
                    this.resetUserForm();
                },
                error: (err) => alert('Error creando: ' + err.message)
            });
        }
    }

    resetUserForm() { 
        this.isEditingUser = false; 
        this.newUser = { fullName: '', email: '', role: 'USER', password: '' }; 
    }

    // --- MÉTODOS CRUD PRODUCTOS ---
    editProduct(p: Car) {
        this.editingProduct = { ...p };
        this.showEditModal = true;
    }

    updateProduct() {
        if (!this.editingProduct.id) return;
        this.isUpdatingProduct = true;
        this.carService.updateCar(this.editingProduct.id, this.editingProduct).subscribe({
            next: () => {
                this.loadAdminProducts();
                this.isUpdatingProduct = false;
                this.updateSuccess = true; // Mostrar mensaje de éxito en la modal
                
                // Cerrar la modal después de 4 segundos
                setTimeout(() => {
                    this.closeEditModal();
                    this.updateSuccess = false;
                }, 4000); // 4 segundos como se solicitó
            },
            error: (err) => {
                console.error(err);
                this.isUpdatingProduct = false;
                alert('Error al guardar cambios');
            }
        });
    }

    closeEditModal() {
        this.showEditModal = false;
        this.isUpdatingProduct = false;
        this.editingProduct = { id: 0, name: '', marca: '', precio: 0, ao: 2024, imagen: '', categoria: 'Sports', status: 1, stock: 1, velocidad: '', aceleracion: '' };
    }

    addProduct() {
        if (!this.newProduct.name || !this.newProduct.marca || !this.newProduct.precio) {
            this.productFormError = 'Nombre, Marca y Precio son campos obligatorios.';
            return;
        }
        this.isSavingProduct = true;
        this.carService.createCar(this.newProduct).subscribe({
            next: () => {
                this.loadAdminProducts();
                this.showToast('✨ Producto añadido');
                this.newProduct = { id: 0, name: '', marca: '', precio: 0, ao: 2024, imagen: '', categoria: 'Sports', status: 1, stock: 1, velocidad: '', aceleracion: '' };
                this.productFormError = '';
                this.isSavingProduct = false;
            },
            error: (err) => {
                console.error(err);
                this.isSavingProduct = false;
                this.productFormError = 'Error al conectar con el servidor.';
            }
        });
    }

    deleteProduct(id: number | undefined) {
        if (!id) return;
        if (confirm('¿Seguro que deseas eliminar este producto?')) {
            this.carService.deleteCar(id).subscribe({
                next: () => {
                    this.loadAdminProducts();
                    this.showToast('🗑️ Producto eliminado');
                },
                error: (err) => console.error(err)
            });
        }
    }

    // --- MÉTODOS CRUD VENTAS ---
    deleteSale(id: number | undefined) {
        if (!id) return;
        if (confirm('¿Seguro que deseas eliminar este registro de venta?')) {
            this.ventaService.deleteSale(id).subscribe({
                next: () => {
                    this.loadAllSales();
                    this.showToast('🗑️ Venta eliminada de registros');
                },
                error: (err) => console.error(err)
            });
        }
    }
}
