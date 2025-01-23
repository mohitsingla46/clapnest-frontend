import { NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [NgIf],
	templateUrl: './header.component.html',
	styleUrl: './header.component.css'
})
export class HeaderComponent {
	router = inject(Router);

	appName: string = environment.appName;
	isMenuOpen: boolean = false;

	@ViewChild('menuRef', { static: false }) menuRef!: ElementRef;

	toggleMenu(): void {
		this.isMenuOpen = !this.isMenuOpen;
	}

	navigateTo(route: string): void {
		// Implement navigation logic (e.g., using Angular Router)
		console.log(`Navigating to ${route}`);
	}

	handleLogout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		this.router.navigate(['/']);
	}
}
