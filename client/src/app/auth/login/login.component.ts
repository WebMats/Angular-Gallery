import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    fbAuthError: string;
    subToError: Subscription;

    constructor(private fbAuth: AuthService) {}

    ngOnInit() {
        this.fbAuthError = !!this.fbAuth.getHasError() && this.fbAuth.getHasError().message;
        this.subToError = this.fbAuth.getHasErrorListener().subscribe(err => {
            this.fbAuthError = err.message;
        })
    }

    onLoginWithEmailAndPassword = (form: NgForm) => {
        this.isLoading = true;
        this.fbAuth.emailAndPasswordSignIn(form.value.email, form.value.password);
    }
    onLoginWithGoogle = () => {
        this.isLoading = true;
        this.fbAuth.googleSignIn();
    }

    ngOnDestroy() {
        this.subToError.unsubscribe();
    }
}