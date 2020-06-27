import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

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
  isLoading: Boolean = false;
  length = 0;
  pageSize = 2;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  currentPage = 1;

  constructor(private postService: PostService) {}

  ngOnInit() {
    console.log("post list component : Ng oninit called !");
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.currentPage);

    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((data) => {
        this.postList = data.posts;
        this.length = data.postCount;
        console.log(data);
        this.isLoading = false;
      });
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
  onDeletePost(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChangePage(pageEvent: PageEvent) {
    this.isLoading = true;
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex + 1;

    this.postService.getPosts(this.pageSize, this.currentPage);
  }
}
