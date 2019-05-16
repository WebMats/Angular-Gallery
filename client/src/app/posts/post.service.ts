import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { getAllGQL, createGQL, deleteGQL, updateOneGQL, getOneGQL  } from '../graphql/posts';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class PostService {
    postsChanged = new Subject<Post[]>();
    downloadURL: Observable<string>;
    private posts: Post[] = [];

    constructor(private http: HttpClient, private router: Router, private storage: AngularFireStorage, private auth: AuthService) {}

    getPosts = () => {
        // waiting for deployed backend url
        this.http.post<{data: { posts: Post[] }}>('/graphql', { 
            query: getAllGQL() 
        }).subscribe(({ data }) => {
            this.posts = data.posts;
            this.postsChanged.next([...this.posts]);
        });
    }
    getPost = (id) => {
        return this.http.post<{data:{ post: Post }}>('/protected', { query: getOneGQL(id)})
    }
    updatePostInBackend = (id, updatedPost) => {
        this.http.post<{data}>('/protected', {
            query: updateOneGQL(id, updatedPost)
        }).subscribe(({ data }) => {
            this.posts = this.posts.map(post => {
                if (post.id = data.updatePost.id) return data.updatePost
                return post;
            });
            this.postsChanged.next([...this.posts]);
            this.router.navigate(["/"])
        })
    }
    updatePost = async (id: string, updatedPost, image: any) => {
        if (typeof(image) === 'object') {
            const tag = document.createElement('a');
            tag.href = image.prevURL;
            const arr = tag.pathname.split('/');
            const location = arr[arr.length - 1];
            try {
                const refD = this.storage.ref(location);
                const refU = this.storage.ref(`${Date.now()}`);
                    refU.put(image, { contentType: image.type }).then(() => {
                        refU.getDownloadURL().subscribe((imageURL: string) => {
                            updatedPost.imageURL = imageURL;
                            this.updatePostInBackend(id, updatedPost);
                        })
                    });
                    refD.delete();
            } catch (err) {
                console.log(err)
            }
        } else {
            updatedPost.imageURL = image;
            this.updatePostInBackend(id, updatedPost);
        }
    }
    addNewPost = (post, image) => {
        const id = this.auth.getUser().id;
        const filePath = `${id}@${Date.now()}`;
        const ref = this.storage.ref(filePath);
        ref.put(image, { contentType: image.type }).then(() => {
            ref.getDownloadURL().subscribe((imageURL: string) => {
                this.http.post<{data}>('/protected', { 
                    query: createGQL(post.title, post.content, `${imageURL}`) 
                }).subscribe(({ data }) => {
                    post.id = data.postId;
                    post.imageURL = imageURL;
                    this.posts.push(post);
                    this.postsChanged.next([...this.posts]);
                    this.router.navigate(["/"])
                });
            })
        })
    }
    deletePost = (postID: string) => {
        this.http.post('/protected', {
            query: deleteGQL(postID)
        }).subscribe((response) => {
            this.posts = this.posts.filter(({ id }) => id !== postID);
            this.postsChanged.next([...this.posts]);
        })
    }
}