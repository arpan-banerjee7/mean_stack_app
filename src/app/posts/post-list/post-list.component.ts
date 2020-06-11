import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  private postSubscription: Subscription;
  // postList = [
  //   { title: "Fisrt", details: "this is the frist post" },
  //   { title: "Second", details: "this is the second post" },
  // ];
  postList: Post[] = [];
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((data) => {
        this.postList = data;
        console.log(data);
      });
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
