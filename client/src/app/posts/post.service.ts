import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { getAllGQL, createGQL, deleteGQL } from '../graphql/posts';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
    postsChanged = new Subject<Post[]>();
    private posts: Post[] = [];

    constructor(private http: HttpClient) {}

    getPosts = () => {
        this.http.post<{data}>('http://localhost:5000/graphql', { 
            query: getAllGQL() 
        }).subscribe(({ data }) => {
            this.posts = data.posts;
            this.postsChanged.next([...this.posts]);
        });
    }
    addNewPost = (post: Post) => {
        this.http.post<{data}>('http://localhost:5000/graphql', { 
            query: createGQL(post.title, post.content) 
        }).subscribe(({ data }) => {
            post.id = data.postId;
            this.posts.push(post);
            this.postsChanged.next([...this.posts]);
        });
    }
    deletePost = (postID: string) => {
        this.http.post('http://localhost:5000/graphql', {
            query: deleteGQL(postID)
        }).subscribe((response) => {
            this.posts = this.posts.filter(({ id }) => id !== postID);
            this.postsChanged.next([...this.posts]);
        })
    }
}