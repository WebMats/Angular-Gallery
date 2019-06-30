import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material';

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
    public postsPerPage: number = 1;
    public pageSizeOptions: number[] = [1, 3, 5]
    posts: Post[] = [];
    authenticated: boolean = false;
    user_id: string;

  constructor( private postsService: PostService, private auth: AuthService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.user_id = !!this.auth.getUser() ? this.auth.getUser().id : null;
    this.authenticated = !!this.auth.getUser();
    this.postsService.getPosts(this.postsPerPage, null);
  
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

  onChangePage = (pageData: PageEvent) => {
    this.isLoading = true;
    if (pageData.pageSize !== this.postsPerPage) {
      this.postsPerPage = pageData.pageSize
      this.postsService.getPosts(this.postsPerPage, null)
    } else if (pageData.previousPageIndex < pageData.pageIndex) {
      this.postsService.getPosts(this.postsPerPage, this.posts[this.posts.length - 1].id)
    } else if (pageData.previousPageIndex > pageData.pageIndex) {
      this.postsService.getPosts(this.postsPerPage, this.posts[this.posts.length - 1].id, false)
    } 
  }

  onDelete = (id: string) => {
    this.isLoading = true
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, null)
    });
  }

  ngOnDestroy() {
    this.subToPosts.unsubscribe();
    this.subToUser.unsubscribe();
    this.subToFireAuth.unsubscribe();
  }

}
