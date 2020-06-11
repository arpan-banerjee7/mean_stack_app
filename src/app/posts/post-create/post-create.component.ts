import { PostService } from "./../post.service";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  // @Output() postCreated = new EventEmitter<Post>();
  // enteredTitle = "";
  // enteredContent = "";

  @ViewChild("formData", { static: false }) postForm: NgForm;
  constructor(private postService: PostService) {}

  ngOnInit() {}
  onSubmit() {
    // const post: Post = {
    //   title: this.enteredTitle,
    //   content: this.enteredContent,
    // };
    // this.postCreated.emit(post);
    console.log(this.postForm.value.content);
    if (this.postForm.invalid) return;
    const post: Post = {
      id: null,
      title: this.postForm.value.title,
      content: this.postForm.value.content,
    };
    this.postService.addPost(post);
    this.postForm.resetForm();
  }
}
