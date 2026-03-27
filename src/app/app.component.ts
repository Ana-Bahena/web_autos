import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserSession } from './services/auth.service';
import { Car, CarService } from './services/car.service';
import { VentaService } from './services/venta.service';

export interface CartItem {
    car: Car;
    quantity: number;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'NovaDrive';

    // Navigation state
    mobileMenuOpen = false;

    // Cars data
    cars: Car[] = [];

    // Filter state
    selectedCategory = 'all';
    categories = ['all', 'Sports', 'Supercar', 'Hypercar'];

    // Search state
    isSearchOpen = false;
    searchQuery = '';

    // Auth modal state
    showAuthModal = false;
    authMode: 'login' | 'register' = 'login';
    authError = '';
    authSuccess = '';
    authLoading = false;

    // Login form
    loginEmail = '';
    loginPassword = '';
    showLoginPassword = false;
    isRobotChecked = false; // Estado del captcha "No soy un robot"

    // Register form
    registerName = '';
    registerEmail = '';
    registerPassword = '';
    registerConfirm = '';
    showRegisterPassword = false;

    // Logged in user (from session)
    loggedInUser: UserSession | null = null;
    userRole: string | null = null;

    // Cart state
    isCartOpen = false;
    cart: CartItem[] = [];
    isPaymentProcessing = false;
    paymentSuccess = false;
    cartToastMessage = '';

    constructor(
        private authService: AuthService,
        private carService: CarService,
        private ventaService: VentaService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Restaurar sesión si existe
        const session = this.authService.getSession();
        if (session) {
            this.loggedInUser = session;
            this.userRole = session.role;
        }

        // Cargar autos del backend y suscribirse al stream reactivo
        this.carService.loadCars();
        this.carService.cars$.subscribe(data => {
            // Solo mostrar disponibles en la landing page
            this.cars = data.filter(c => c.status === 1);
        });
    }

    // --- Computed ---
    get filteredCars(): Car[] {
        let cars = this.cars;
        if (this.selectedCategory !== 'all') {
            cars = cars.filter(car => car.categoria === this.selectedCategory);
        }
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase().trim();
            cars = cars.filter(car =>
                car.name.toLowerCase().includes(q) ||
                car.marca.toLowerCase().includes(q) ||
                car.categoria.toLowerCase().includes(q)
            );
        }
        return cars;
    }

    get featuredCars(): Car[] {
        return this.cars.filter(car => car.precio > 100000); // Featured if price > 100,000
    }

    // --- Navigation ---
    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        this.mobileMenuOpen = false;
    }

    // --- Search ---
    toggleSearch(): void {
        this.isSearchOpen = !this.isSearchOpen;
        if (this.isSearchOpen) {
            setTimeout(() => {
                const input = document.getElementById('navSearchInput');
                if (input) (input as HTMLInputElement).focus();
            }, 150);
        } else {
            this.searchQuery = '';
        }
    }

    closeSearchOnEsc(event: KeyboardEvent): void {
        if (event.key === 'Escape') this.isSearchOpen = false;
    }

    performNavSearch(): void {
        if (this.searchQuery.trim()) {
            this.isSearchOpen = false;
            this.scrollToSection('catalog');
        }
    }

    // --- Category Filter ---
    filterByCategory(category: string): void {
        this.selectedCategory = category;
    }

    // --- Format ---
    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    }

    // --- Auth Modal ---
    openAuthModal(mode: 'login' | 'register'): void {
        this.authMode = mode;
        this.showAuthModal = true;
        this.authError = '';
        this.authSuccess = '';
        this.clearForms();
        document.body.style.overflow = 'hidden';
    }

    closeAuthModal(): void {
        this.showAuthModal = false;
        this.authError = '';
        this.authSuccess = '';
        document.body.style.overflow = '';
    }

    switchMode(mode: 'login' | 'register'): void {
        this.authMode = mode;
        this.authError = '';
        this.authSuccess = '';
        this.clearForms();
    }

    clearForms(): void {
        this.loginEmail = '';
        this.loginPassword = '';
        this.registerName = '';
        this.registerEmail = '';
        this.registerPassword = '';
        this.registerConfirm = '';
        this.showLoginPassword = false;
        this.showRegisterPassword = false;
        this.authLoading = false;
        this.isRobotChecked = false; // Reset captcha
    }

    // --- LOGIN (conecta al backend Spring Boot) ---
    login(): void {
        this.authError = '';
        if (!this.loginEmail || !this.loginPassword) {
            this.authError = 'Por favor completa todos los campos.';
            return;
        }

        this.authLoading = true;

        const loginPayload = {
            email: this.loginEmail,
            password: this.loginPassword,
            captchaToken: this.isRobotChecked ? 'NO_ROBOT_VERIFIED' : ''
        };

        this.authService.login(loginPayload)
            .subscribe({
                next: (response) => {
                    this.authLoading = false;
                    if (response.success) {
                        // Guardar sesión
                        this.authService.saveSession(response);
                        this.loggedInUser = this.authService.getSession();
                        this.closeAuthModal();
                        // Redirigir al dashboard
                        this.router.navigate(['/dashboard']);
                    } else {
                        this.authError = response.message;
                    }
                },
                error: () => {
                    this.authLoading = false;
                    // Si el backend no está corriendo, usar modo local como fallback
                    this.loginLocalFallback();
                }
            });
    }

    /**
     * Fallback cuando el backend no está disponible.
     * Permite probar el frontend sin necesidad del backend.
     */
    private loginLocalFallback(): void {
        const localUsers = [
            { email: 'admin@novadrive.com', password: 'Admin1234!', fullName: 'Admin NovaDrive', role: 'ADMIN' }
        ];
        const user = localUsers.find(
            u => u.email === this.loginEmail && u.password === this.loginPassword
        );
        if (user) {
            this.authService.saveSession({
                success: true,
                message: 'Login local',
                token: 'local-token',
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                userId: 999
            });
            this.loggedInUser = this.authService.getSession();
            this.closeAuthModal();
            this.router.navigate(['/dashboard']);
        } else {
            this.authError = 'Correo o contraseña incorrectos. (Backend no disponible - modo local)';
        }
    }

    // --- REGISTER (conecta al backend Spring Boot) ---
    register(): void {
        this.authError = '';
        if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirm) {
            this.authError = 'Por favor completa todos los campos.';
            return;
        }
        if (this.registerPassword !== this.registerConfirm) {
            this.authError = 'Las contraseñas no coinciden.';
            return;
        }
        if (this.registerPassword.length < 8) {
            this.authError = 'La contraseña debe tener al menos 8 caracteres.';
            return;
        }

        this.authLoading = true;

        this.authService.register({
            fullName: this.registerName,
            email: this.registerEmail,
            password: this.registerPassword,
            confirmPassword: this.registerConfirm
        }).subscribe({
            next: (response) => {
                this.authLoading = false;
                if (response.success) {
                    this.authSuccess = '¡Cuenta creada exitosamente!';
                    // Auto-login después del registro
                    this.authService.saveSession(response);
                    setTimeout(() => {
                        this.closeAuthModal();
                        this.router.navigate(['/dashboard']);
                    }, 1500);
                } else {
                    this.authError = response.message;
                }
            },
            error: () => {
                this.authLoading = false;
                // Modo local si no hay backend
                this.authSuccess = '¡Cuenta creada (modo local)!';
                this.authService.saveSession({
                    success: true,
                    message: 'OK',
                    token: 'local-' + Date.now(),
                    fullName: this.registerName,
                    email: this.registerEmail,
                    role: 'USER',
                    userId: Date.now()
                });
                setTimeout(() => {
                    this.loggedInUser = this.authService.getSession();
                    this.closeAuthModal();
                    this.router.navigate(['/dashboard']);
                }, 1500);
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.loggedInUser = null;
        this.router.navigate(['/']);
    }

    goToDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    // --- Cart ---
    toggleCart(): void {
        this.isCartOpen = !this.isCartOpen;
        if (!this.isCartOpen) {
            // Reset payment states when closing cart
            this.isPaymentProcessing = false;
            this.paymentSuccess = false;
        }
    }

    addToCart(car: Car): void {
        // Requiere sesión activa
        if (!this.loggedInUser) {
            this.openAuthModal('login');
            this.authError = 'Debes iniciar sesión para agregar autos al carrito.';
            return;
        }

        const existingItem = this.cart.find(item => item.car.id === car.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ car, quantity: 1 });
        }

        // Mostrar mensaje temporal en lugar de abrir el carrito
        this.cartToastMessage = `¡${car.name} agregado al carrito!`;
        setTimeout(() => {
            this.cartToastMessage = '';
        }, 3000);
    }

    removeFromCart(carId: number): void {
        this.cart = this.cart.filter(item => item.car.id !== carId);
    }

    get cartTotal(): number {
        return this.cart.reduce((total, item) => total + (item.car.precio * item.quantity), 0);
    }

    get cartItemCount(): number {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // --- Payment Simulation ---
    processPayment(): void {
        if (this.cart.length === 0 || !this.loggedInUser) return;

        this.isPaymentProcessing = true;

        // Generar las ventas en el backend para cada item (o una venta total, pero el backend espera VentaRequest por carId)
        // Usaremos Promise.all para esperar a que todas las ventas se registren
        const checkoutPromises = this.cart.map(item => {
            // Repetir N veces según cantidad
            const itemPromises = [];
            for (let i = 0; i < item.quantity; i++) {
                itemPromises.push(this.ventaService.createSale({
                    userId: this.loggedInUser!.id,
                    carId: item.car.id!
                }).toPromise());
            }
            return Promise.all(itemPromises);
        });

        Promise.all(checkoutPromises).then(() => {
            // Notificar recarga de autos para actualizar stock en UI
            this.carService.loadCars();

            this.isPaymentProcessing = false;
            this.paymentSuccess = true;
            this.cart = []; // Limpiar carrito

            // Cerrar mensaje de éxito después de unos segundos
            setTimeout(() => {
                this.isCartOpen = false;
                this.paymentSuccess = false;
            }, 4000); // 4 segundos como se solicitó (rango 3-5)
        }).catch(err => {
            console.error('Error en el checkout:', err);
            this.isPaymentProcessing = false;
            alert('Hubo un error al procesar tu compra. Por favor intenta de nuevo.');
        });
    }
}
