import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Credentials, User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { signUpGQL, signInGQL } from '../graphql/auth';
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: Observable<any>;
  isSignUp: boolean = false;
  private token: string = '';
  private user: User | null;
  private authStateChanged = new Subject<User | null >();
  hasError: { message: string | null };
  private hasErrorChanged = new Subject<{message}>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private http: HttpClient) { 
    this.isAuthenticated = this.afAuth.authState;
    this.afAuth.auth.onAuthStateChanged(user => {
      if (!user) return;
      if (this.isSignUp) return;
      this.signInUser(<any>user);
    })
  }

  getToken = (): string => this.token;
  getAuthStateListener = () => this.authStateChanged.asObservable();
  getHasErrorListener = () => this.hasErrorChanged.asObservable();
  getUser = () => this.user;
  getHasError = () => this.hasError;
  googleSignIn = async () => {
    this.isSignUp = false;
    const provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" })
    const credentials = await this.afAuth.auth.signInWithPopup(provider);
    if (credentials.additionalUserInfo.isNewUser) {
      credentials.user.delete();
      this.router.navigate(['/signup']);
      this.setAndPropagateErrorState({ message: 'This account does not exist, create it now.' });
    } else {
      this.signInUser(<any>credentials.user);
    }
  }
  googleSignUp = async () => {
    this.isSignUp = true;
    const provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" })
    const credentials = await this.afAuth.auth.signInWithPopup(provider);
    if (!credentials.additionalUserInfo.isNewUser) {
      this.afAuth.auth.signOut().then(_ => {
        this.token = '';
        this.router.navigate(['/login']);
        this.setAndPropagateErrorState({ message: 'This account exists, we redirected you to login.' });
      }).catch(err => {
        console.log(err)
      });
    } else {
      this.signUpUser(<any>credentials.user);
    }
  }

  emailAndPasswordSignIn = async (email: string, password: string) => {
    this.isSignUp = false;
    try {
      const credentials = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.signInUser(<any>credentials.user);
    } catch (err) {
      this.setAndPropagateErrorState({ message: err.message });
    }
  }

  emailAndPasswordSignUp = async (email: string, password: string) => {
    this.isSignUp = true;
    try {
      const credentials = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.signUpUser(<any>credentials.user);
    } catch (err) {
      this.setAndPropagateErrorState({ message: err.message });
    }
  }

  private signUpUser = ({ email, uid: id, ra: token }: Credentials) => {
    this.token = token;
    this.http.post<{data}>('http://localhost:5000/graphql', {query: signUpGQL(email, id, token)}).subscribe(({data}) => {
      const { mongoId: id, firebaseId, email } = data.signup;
      if (!!id) {
        this.propagateAuthStateAndNavigate({id, firebaseId, email});
        this.setAndPropagateErrorState({ message: null });
      }
    })
  }
  private signInUser = ({ email, uid: id, ra: token }: Credentials) => {
    this.token = token;
    this.http.post<{data}>('http://localhost:5000/graphql', {query: signInGQL(email, id, token)}).subscribe(({data}) => {
      const { mongoId: id, firebaseId, email } = data.signin;
      if (!!id) {
        this.propagateAuthStateAndNavigate({id, firebaseId, email})
        this.setAndPropagateErrorState({ message: null });
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
    this.router.navigate(['/'])
    this.user = user;
    this.authStateChanged.next(this.user);
  }
  setAndPropagateErrorState = (error) => {
    this.hasError = error;
    this.hasErrorChanged.next(this.hasError);
  }
}
