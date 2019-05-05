import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading: boolean = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postID: string;

  constructor( private postService: PostService, public route: ActivatedRoute ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: Validators.required } ),
      'image': new FormControl(null, { validators: Validators.required, asyncValidators: mimeType })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postID).subscribe(({ data }) => {
          this.post = data.post;
          this.form.setValue({ 
            'title': this.post.title, 
            'content': this.post.content,
            'image': this.post.imageURL
          });
          this.isLoading = false;
        })
      } else {
        this.mode = 'create';
        this.postID = null;
      }
    })
  }

  onImagePicked = (e: Event) => {
    const file = (e.target as HTMLInputElement).files[0];
    this.form.patchValue({ 'image': file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    }
    reader.readAsDataURL(file);
  }

  onSavePost = () => {
    if (this.form.invalid) return;
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addNewPost({ title: this.form.value.title, content: this.form.value.content }, this.form.value.image);
    } else {
      typeof this.form.value.image !== 'string' && (this.form.value.image.prevURL = this.post.imageURL);
      this.postService.updatePost(this.postID, { title: this.form.value.title, content: this.form.value.content }, this.form.value.image);
    }
    this.form.reset();
  }

}
