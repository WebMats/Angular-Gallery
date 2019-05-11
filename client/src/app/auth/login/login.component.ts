import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading: boolean = false;

    constructor(private auth: AuthService) {}

    onLoginWithEmailAndPassword = (form: NgForm) => {
        this.isLoading = true;
        this.auth.emailAndPasswordSignIn(form.value.email, form.value.password);
    }
    onLoginWithGoogle = () => {
        this.isLoading = true;
        this.auth.googleSignIn();
    }
}