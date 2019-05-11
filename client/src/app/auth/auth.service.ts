import { Injectable, OnInit } from '@angular/core';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Credentials, User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { signUpGQL, signInGQL } from '../graphql/auth';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateChanged = new Subject<User | null >();
  private token: string = '';
  private user: User | null;
  constructor(private router: Router, private afAuth: AngularFireAuth, private http: HttpClient) { }

  getToken = (): string => this.token;
  getAuthStateListener = () => this.authStateChanged.asObservable();
  getUser = () => this.user;
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

  private signUpUser = ({ email, uid: id, ra: token }: Credentials) => {
    this.token = token;
    this.http.post<{data}>('http://localhost:5000/graphql', {query: signUpGQL(email, id, token)}).subscribe(({data}) => {
      const { mongoId: id, firebaseId, email } = data.signup;
      if (!!id) {
        this.propagateAuthStateAndNavigate({id, firebaseId, email})
      }
    })
  }
  private signInUser = ({ email, uid: id, ra: token }: Credentials) => {
    this.token = token;
    this.http.post<{data}>('http://localhost:5000/graphql', {query: signInGQL(email, id, token)}).subscribe(({data}) => {
      const { mongoId: id, firebaseId, email } = data.signin;
      if (!!id) {
        this.propagateAuthStateAndNavigate({id, firebaseId, email})
      }
    })
  }
  signOut = () => {
    this.afAuth.auth.signOut().then(_ => {
      this.token = '';
      this.propagateAuthStateAndNavigate(null);
    }).catch(err => {
      console.log(err)
    });
  }

  propagateAuthStateAndNavigate = (user) => {
    this.user = user;
    this.authStateChanged.next(this.user);
    this.router.navigate(['/'])
  }

  listenForStateChange = () => this.afAuth.auth.onAuthStateChanged(user => {
    console.log(user, 'CHANGED')
  });

}
