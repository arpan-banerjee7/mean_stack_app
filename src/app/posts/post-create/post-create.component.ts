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
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  @ViewChild("formData", { static: false }) postForm: NgForm;
  private mode = "create";
  selectedPostId: string;
  header = "";
  message = "";
  post: Post[];
  isLoading: Boolean = false;
  constructor(
    private postService: PostService,
    private rout: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.rout.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit";
        this.selectedPostId = paramMap.get("id");
        this.isLoading = true;
        this.postService.getPost(this.selectedPostId).subscribe((post) => {
          this.header = post.title;
          this.message = post.content;
          this.post = post;
          this.isLoading = false;
          console.log(post);
        });
      } else {
        this.mode = "create";
        this.selectedPostId = null;
      }
    });
  }
  onSubmit() {
    console.log(this.postForm.value.content);
    this.isLoading = true;
    if (this.mode === "create") {
      if (this.postForm.invalid) return;
      const post: Post = {
        id: null,
        title: this.postForm.value.title,
        content: this.postForm.value.content,
      };
      this.postService.addPost(post);
      this.router.navigate(["/list"]);
    } else {
      this.isLoading = true;
      const post: Post = {
        id: this.selectedPostId,
        title: this.postForm.value.title,
        content: this.postForm.value.content,
      };
      this.postService.updatePost(post);
      this.router.navigate(["/list"]);
    }

    this.postForm.resetForm();
  }
}
