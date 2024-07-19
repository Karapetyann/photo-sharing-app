import {Component} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/photos']),
      error: err => this.error = 'Login failed. Please try again later.'
    });
  }

}
