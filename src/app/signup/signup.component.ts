import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  email: string = '';

 
    constructor(private http: HttpClient, private router: Router,) {}

  signup() {
    const credentials = { username: this.username, password: this.password, email: this.email };
    this.http.post<any>('http://localhost:8000/signup/', credentials).subscribe(
      (response) => {
        // Handle successful signup (e.g., display success message)
        alert(`${response.user.username} is created sucessfully`)
        console.log('Signup successful:', response.user.username);
        this.router.navigate(['/login']);
      },
      (error) => {
        // Handle signup error (e.g., display error message)
        alert("please fill all the details")
        // console.error('Signup error:', error);
      }
    );
  }
}
