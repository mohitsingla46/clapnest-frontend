import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/services/app.services';

@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
	appName: string = environment.appName;
	signupForm!: FormGroup;
	errorMessage: string | null = null;

	router = inject(Router);
	toastr = inject(ToastrService);
	appService = inject(AppService);

	ngOnInit(): void {
		this.signupForm = new FormGroup({
			name: new FormControl('', Validators.required),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', Validators.required),
		});
	}

	public async onSubmit(): Promise<void> {
		const user = {
			name: this.signupForm.get('name')?.value,
			email: this.signupForm.get('email')?.value,
			password: this.signupForm.get('password')?.value
		};

		this.appService.signup(user).subscribe({
			next: (response) => {
				this.toastr.success('Your account has been created successfully!');
				this.router.navigate(['/']);
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
