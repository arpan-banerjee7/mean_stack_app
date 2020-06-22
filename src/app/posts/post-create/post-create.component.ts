import { mimeType } from "./mime-type.validator";
import { PostService } from "./../post.service";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Post } from "../post.model";
import { NgForm, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  // @ViewChild("formData", { static: false }) postForm: NgForm;
  // header = "";
  // message = "";
  //post: Post[];

  private mode = "create";
  selectedPostId: string;
  postForm: FormGroup;
  isLoading: Boolean = false;
  imagePreview: string;

  constructor(
    private postService: PostService,
    private rout: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: [null, Validators.required],
      content: [null, Validators.required],
      image: [null, [Validators.required], mimeType],
    });
    this.rout.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit";
        this.selectedPostId = paramMap.get("id");
        this.isLoading = true;
        this.postService.getPost(this.selectedPostId).subscribe((post) => {
          this.postForm.setValue({
            title: post.title,
            content: post.content,
            image: post.imagePath,
          });
          // this.header = post.title;
          // this.message = post.content;
          // this.post = post;
          this.isLoading = false;
          console.log(post);
        });
      } else {
        this.mode = "create";
        this.selectedPostId = null;
      }
    });

    // this.postForm.get("image").valueChanges.subscribe(() => {
    //   console.log("value changed");
    // });
  }
  onSubmit() {
    if (this.postForm.invalid) return;
    console.log(this.postForm.value.content);
    this.isLoading = true;
    if (this.mode === "create") {
      this.postService.addPost(
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
      this.router.navigate(["/list"]);
    } else {
      this.isLoading = true;

      this.postService.updatePost(
        this.selectedPostId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
      this.router.navigate(["/list"]);
    }

    this.postForm.reset();
  }

  onImagePicked(event: Event) {
    console.log((event.target as HTMLInputElement).files);
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
