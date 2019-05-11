import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authenticated: boolean = false;
  private subscription: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.subscription = this.auth.getAuthStateListener().subscribe(user => {
      this.authenticated = !!user;
    });
  }

  onLogout = () => {
    this.auth.signOut();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
