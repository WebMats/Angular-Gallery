import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";


@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    isLoading: boolean = false;

    constructor(private fbAuth: AuthService) {}

    onSignUpWithEmailAndPassword = (form: NgForm) => {
        this.isLoading = true;
        this.fbAuth.emailAndPasswordSignUp(form.value.email, form.value.password);
    }
    onSignUpWithGoogle = () => {
        this.isLoading = true;
        this.fbAuth.googleSignIn();
    }

}