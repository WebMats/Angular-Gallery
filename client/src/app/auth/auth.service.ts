import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Credentials } from './user.model';
import { HttpClient } from '@angular/common/http';
import { signUpGQL, signInGQL } from '../graphql/auth';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authStateChanged = new Subject<string>();
  private token: string = '';
  private user: object = {};
  constructor(private router: Router, private afAuth: AngularFireAuth, private http: HttpClient) { }

  googleSignIn = async () => {
    const provider = new auth.GoogleAuthProvider();
    const credentials = await this.afAuth.auth.signInWithPopup(provider);
    return credentials.additionalUserInfo.isNewUser ? this.signUpUser(<any>credentials.user) : this.signInUser(<any>credentials.user);
  }

  emailAndPasswordSignIn = async (email: string, password: string) => {
    const credentials = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    return this.signInUser(<any>credentials.user);
  }

  emailAndPasswordSignUp = async (email: string, password: string) => {
    const credentials = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    return this.signUpUser(<any>credentials.user);
  }

  signOut = async () => {
    await this.afAuth.auth.signOut();
    this.token = '';
    this.user = {};
    this.authStateChanged.next(this.token);
  }

  getToken = (): string => this.token;

  private signUpUser = ({ email, uid: id, ra: token }: Credentials) => {
    this.token = token;
    this.http.post<{data}>('http://localhost:5000/graphql', {query: signUpGQL(email, id, token)}).subscribe(({data}) => {
      console.log(data);
      this.authStateChanged.next(this.token);
    })
  }
  private signInUser = ({ email, uid: id, ra: token }: Credentials) => {
    this.token = token;
    this.http.post<{data}>('http://localhost:5000/graphql', {query: signInGQL(email, id, token)}).subscribe(({data}) => {
      console.log(data);
      this.authStateChanged.next(this.token);
    })
  }

}
