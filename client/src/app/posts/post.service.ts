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
    public page: number = 0;
    public total: number = 0;

    constructor(private http: HttpClient, private router: Router, private storage: AngularFireStorage, private auth: AuthService) {}

    getPosts = (pageSize, after, next = true) => {
        this.http.post<{data: { posts: { posts: Post[], page: number, total: number } } }>('/graphql', { 
            query: getAllGQL(pageSize, after, next) 
        }).subscribe(({ data }) => {
            this.posts = data.posts.posts;
            this.page = data.posts.page;
            this.total = data.posts.total;
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
                    this.router.navigate(["/"])
                });
            })
        })
    }
    deletePost = (postID: string) => {
        return this.http.post('/protected', {
            query: deleteGQL(postID)
        })
    }
}