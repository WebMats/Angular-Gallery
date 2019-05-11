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
    subscription: Subscription;
    posts: Post[] = [];
    authenticated: boolean = false;
    private authSub: Subscription;

  constructor( private postsService: PostService, private auth: AuthService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.subscription = this.postsService.postsChanged.subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    })
    this.authenticated = !!this.auth.getUser();
    this.authSub = this.auth.getAuthStateListener().subscribe(user => {
      this.authenticated = !!user;
    });
  }

  onDelete = (id: string) => {
    this.postsService.deletePost(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.authSub.unsubscribe();
  }

}
