import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgotpassword',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss',
})
export class ForgotpasswordComponent {
  msgError: string = '';
  success: string = '';
  step: number = 1;
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/),
    ]),
  });
  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]\w{7,}$/),
    ]),
  });

  verifyEmailSubmit(): void {
    let emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);
    this._AuthService.setVerifyEmail(this.verifyEmail.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.statusMsg === 'success') {
          this.step = 2;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  verifyCodeSubmit(): void {
    this._AuthService.setVerifyCode(this.verifyCode.value).subscribe({
      next: (res) => {
        console.log('Response:', res);
        if (res.status && res.status.toLowerCase() === 'success') {
          this.step = 3;
          console.log('Step updated to 3');
        } else {
          console.warn('Response did not match expected success message');
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }

  resetPasswordSubmit(): void {
    this._AuthService.setResetPassword(this.resetPassword.value).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userToken', res.token);
        this._AuthService.saveUserData();
        setTimeout(() => {
          this._Router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
