import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class PostService {
  private postList: Post[] = [];

  private postUpdated = new Subject<Post[]>();

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
  getPosts() {
    return [...this.postList];
  }

  addPost(post: Post) {
    this.postList.push(post);
    return this.postUpdated.next([...this.postList]);
  }
}
