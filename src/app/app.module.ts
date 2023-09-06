import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PdfChatComponent } from './pdf-chat/pdf-chat.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component'; // Import the LoginComponent
import { SignupComponent } from './signup/signup.component'
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'pdf-chat', component: PdfChatComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    PdfChatComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent
  ],
  
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
