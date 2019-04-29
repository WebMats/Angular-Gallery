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

    subscription: Subscription;
    posts: Post[] = [];

  constructor( private postsService: PostService ) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.subscription = this.postsService.postsChanged.subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }

  onDelete = (id: string) => {
    this.postsService.deletePost(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
