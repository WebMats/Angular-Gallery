import { NgModule } from "@angular/core";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from "src/angular-material.module";
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        AngularMaterialModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
    ],
})
export class AuthModule {}