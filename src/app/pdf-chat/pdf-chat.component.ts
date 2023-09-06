// import { Component } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
// import { AuthService } from '../auth.service'; // Import the AuthService

// @Component({
//   selector: 'app-pdf-chat',
//   templateUrl: './pdf-chat.component.html',
//   styleUrls: ['./pdf-chat.component.css']
// })
// export class PdfChatComponent {
//   // ...

//   askQuestion() {
//     if (!this.selectedFile || !this.question) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append('pdf', this.selectedFile);
//     formData.append('query', this.question);

//     const token = this.authService.getToken(); // Get the token from AuthService
//     const headers = new HttpHeaders().set('Authorization', `Token ${token}`); // Include the token in the headers

//     this.http.post<any>('http://localhost:8000/pdf_chat_backend/', formData, { headers })
//       .subscribe(
//         response => {
//           this.response = response.response;
//         },
//         error => {
//           console.error('Error:', error);
//         }
//       );
//   }
// }




import { Component } from '@angular/core';
import { AuthService } from "../auth.service";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pdf-chat',
  templateUrl: './pdf-chat.component.html',
  styleUrls: ['./pdf-chat.component.css']
})
export class PdfChatComponent {
  selectedFile: File | null = null;
  question: string = '';
  response: string = '';
 
  constructor(private authService: AuthService, private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit() {
    if (!this.selectedFile || !this.question) {
      // Handle form validation error
      return;
    }

    const formData: FormData = new FormData();
    formData.append('pdf', this.selectedFile);
    formData.append('query', this.question);

    const token = this.authService.getToken();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.post<any>('http://localhost:8000/pdf_chat_backend/', formData, { headers }).subscribe(
      response => {
        this.response = response.response;
      },
      error => {
        // Handle error
      }
    );
  }
}
