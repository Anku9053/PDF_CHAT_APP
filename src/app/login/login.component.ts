import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Import the AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  login() {
    const credentials = { username: this.username, password: this.password };
    this.http.post<any>('http://localhost:8000/login/', credentials).subscribe(
      (response) => {
        // Handle successful login (e.g., store token, redirect)
        const token = response.token; // Assuming your backend returns a 'token' field
        if (token) {
          this.authService.setToken(token); // Store the token
          alert(`${this.username} Login sucessfull`)
          this.router.navigate(['/pdf-chat']);
        }
      },
      (error) => {
        // Handle login error (e.g., display error message)
        console.error('Login error:', error);
      }
    );
  }
}
