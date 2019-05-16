import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from "src/angular-material.module";
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { RouterModule } from "@angular/router";



@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
    ],
})
export class PostsModule {}