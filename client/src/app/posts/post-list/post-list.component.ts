import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    subscription: Subscription;
    posts: Post[] = [];

  constructor( private postsService: PostService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.subscription = this.postsService.postsChanged.subscribe((posts: Post[]) => {
      console.log(posts)
      this.posts = posts;
      this.isLoading = false;
    })
  }

  onDelete = (id: string) => {
    this.postsService.deletePost(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
