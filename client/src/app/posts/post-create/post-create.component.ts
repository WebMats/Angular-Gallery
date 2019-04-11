import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor( private postService: PostService ) { }

  ngOnInit() {
  }

  onAddPost = (form: NgForm) => {
    const post = {
      title: form.value.title,
      content: form.value.content
    }
    this.postService.addNewPost(post);
    form.resetForm();
  }

}
