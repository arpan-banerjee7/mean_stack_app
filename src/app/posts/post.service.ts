import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class PostService {
  constructor(private httpClient: HttpClient) {}
  private postList: Post[] = [];

  private postUpdated = new Subject<Post[]>();

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
  getPosts() {
    this.httpClient
      .get<{ message: string; posts: Post[] }>(
        "http://localhost:3000/api/posts"
      )
      .subscribe((data) => {
        this.postList = data.posts;
        console.log(data.posts);
        this.postUpdated.next([...this.postList]);
      });
  }

  addPost(post: Post) {
    this.httpClient
      .post<{ message: string }>("http://localhost:3000/api/post", post)
      .subscribe((data) => {
        console.log(data.message);
        this.postList.push(post);
        return this.postUpdated.next([...this.postList]);
      });
  }
}
