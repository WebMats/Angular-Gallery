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
  // posts: Post[] = [
  //   { title: 'First Post Title', content: 'First Post Content' },
  //   { title: 'Second Post Title', content: 'Second Post Content' },
  //   { title: 'Third Post Title', content: 'Third Post Content' }
  // ]
    subscription: Subscription;
    posts: Post[];

  constructor( private postsService: PostService ) { }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.subscription = this.postsService.postsChanged.subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
