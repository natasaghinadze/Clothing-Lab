import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { notificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthReady() {
    throw new Error('Method not implemented.');
  }
  private firebaseAuth = inject(Auth);
  private notify = inject(notificationService);

  user = signal<User | null>(null);
  isReady = signal(false);

  constructor() {
    onAuthStateChanged(this.firebaseAuth, (user) => {
      this.user.set(user);
      this.isReady.set(true);
    });
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      this.notify.success('წარმატებით შეხვედი სისტემაში');
    } catch (error: any) {
      const code = error.code;

      if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        this.notify.errorMessage('ელფოსტა ან პაროლი არასწორია');
      } else if (code === 'auth/too-many-requests') {
        this.notify.errorMessage('ძალიან ბევრჯერ შეცდომით სცადეთ. მოგვიანებით სცადეთ');
      } else {
        this.notify.errorMessage('შეცდომა ავტორიზაციის დროს');
      }

      throw error;
    }
  }

  async waitUntilReady(): Promise<void> {
    while (!this.isReady()) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }

  logout() {
    return signOut(this.firebaseAuth);
  }

  isLoggedIn(): boolean {
    return !!this.user();
  }

  forgotPassword(email: string) {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }
}