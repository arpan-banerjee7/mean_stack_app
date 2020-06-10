import { Component, OnInit, Input } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit {
  // postList = [
  //   { title: "Fisrt", details: "this is the frist post" },
  //   { title: "Second", details: "this is the second post" },
  // ];
  postList: Post[] = [];
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postList = this.postService.getPosts();
    this.postService.getPostUpdateListener().subscribe((data) => {
      this.postList = data;
    });
  }
}
