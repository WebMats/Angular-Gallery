import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from 'src/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// COMPONENTS
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './auth/auth-interceptor';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { AngularFirebaseModule } from './angular-firebase.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PostsModule,
    AngularFirebaseModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
