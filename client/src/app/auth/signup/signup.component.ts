import { Component, OnInit, OnDestroy } from "@angular/core";``
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";


@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    fbAuthError: string = '';
    subToError: Subscription;

    constructor(private fbAuth: AuthService) {}

    ngOnInit() {
        this.fbAuthError = !!this.fbAuth.getHasError() && this.fbAuth.getHasError().message;
        this.subToError = this.fbAuth.getHasErrorListener().subscribe(err => {
            this.fbAuthError = err.message;
        })
    }

    onSignUpWithEmailAndPassword = (form: NgForm) => {
        this.isLoading = true;
        this.fbAuth.emailAndPasswordSignUp(form.value.email, form.value.password);
    }
    onSignUpWithGoogle = () => {
        this.isLoading = true;
        this.fbAuth.googleSignUp();
    }

    ngOnDestroy() {
        this.subToError.unsubscribe();
    }
}