import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { stringifyForDisplay } from '@apollo/client/utilities';

import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/services/app.services';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
	appName: string = environment.appName;
	loginForm!: FormGroup;
	errorMessage: string | null = null;

	router = inject(Router);
	toastr = inject(ToastrService);
	appService = inject(AppService);

	ngOnInit(): void {
		this.loginForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', Validators.required)
		});
	}

	public async onSubmit(): Promise<void> {
		const email = this.loginForm.get('email')?.value;
		const password = this.loginForm.get('password')?.value;

		this.appService.login(email, password).subscribe({
			next: (response) => {
				localStorage.setItem('token', response.data.signin.token);
				localStorage.setItem('user', JSON.stringify(response.data.signin.user));
				this.toastr.success('You are logged in successfully!');
				this.router.navigate(['/chat']);
			},
			error: (error) => {
				if (error.graphQLErrors && error.graphQLErrors.length > 0) {
					// Extract and display the error message
					this.toastr.error(error.graphQLErrors[0].message, 'Error');
				} else if (error.networkError) {
					this.toastr.error('Network error occurred. Please check your connection.', 'Error');
				} else {
					this.toastr.error('Something went wrong at our end. Please try again later.', 'Error');
				}
			},
		});
	}
}
