import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
    postsChanged = new Subject<Post[]>();
    private posts: Post[] = [];

    constructor(private http: HttpClient) {}

    getPosts = () => {
        this.http.get<Post[]>('http://localhost:5000/api/posts').subscribe((posts) => {
            this.posts = posts;
            this.postsChanged.next([...this.posts]);
        });
    }
    addNewPost = (post: Post) => {
        this.posts.push(post);
        this.postsChanged.next([...this.posts]);
    }
}