import { inject, Injectable } from "@angular/core";
import { auth } from "../../app.config";
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { notificationService } from "./notification.service";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private firebaseAuth: Auth = auth
    private notify = inject(notificationService)

    register (email: string, password: string){
        return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
    }

     async login(email: string, password: string) {
        try {
            await signInWithEmailAndPassword(this.firebaseAuth, email, password);
            this.notify.success("წარმატებით შეხვედი სისტემაში");
        } catch (error: any) {
            const code = error.code;
            if(code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                this.notify.errorMessage("ელფოსტა ან პაროლი არასწორია");
            } else if(code === 'auth/too-many-requests') {
                this.notify.errorMessage("ძალიან ბევრჯერ შეცდომით სცადეთ. მოგვიანებით სცადეთ");
            } else {
                this.notify.errorMessage("შეცდომა ავტორიზაციის დროს");
            }
            throw error; 
        }
    }

    logout(){
        return signOut(this.firebaseAuth)
    }

    watchAuthState(callback: (user: User | null) => void){
        return onAuthStateChanged(this.firebaseAuth, callback)
    }

}