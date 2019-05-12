import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    private subToPosts: Subscription;
    private subToUser: Subscription;
    private subToFireAuth: Subscription;
    posts: Post[] = [];
    authenticated: boolean = false;
    user_id: string;

  constructor( private postsService: PostService, private auth: AuthService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.user_id = !!this.auth.getUser() ? this.auth.getUser().id : null;
    this.authenticated = !!this.auth.getUser();
    this.postsService.getPosts();
  
    this.subToPosts = this.postsService.postsChanged.subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    })

    this.subToFireAuth = this.auth.isAuthenticated.subscribe(user => {
      this.authenticated = !!user
    })

    this.subToUser = this.auth.getAuthStateListener().subscribe(user => {
      this.user_id = !!user ? user.id : undefined;
      this.authenticated = !!user;
    });
  }

  onDelete = (id: string) => {
    this.postsService.deletePost(id);
  }

  ngOnDestroy() {
    this.subToPosts.unsubscribe();
    this.subToUser.unsubscribe();
    this.subToFireAuth.unsubscribe();
  }

}
