import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
    postsChanged = new Subject<Post[]>();
    private posts: Post[] = [];

    getPosts = (): Post[] => {
        return [...this.posts]
    }
    addNewPost = (post: Post) => {
        this.posts.push(post);
        this.postsChanged.next([...this.posts]);
    }
}