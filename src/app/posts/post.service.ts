import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

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
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map((data) => {
          return data.posts.map((data) => {
            return {
              title: data.title,
              content: data.content,
              id: data._id,
            };
          });
        })
      )
      .subscribe((data) => {
        this.postList = data;
        console.log(data);
        this.postUpdated.next([...this.postList]);
      });
  }

  getPost(id: string) {
    return this.httpClient
      .get<{ message: string; post: any }>(
        `http://localhost:3000/api/post/${id}`
      )
      .pipe(
        map((data) => {
          console.log(data.message);
          return data.post;
        })
      );
  }

  updatePost(post: Post) {
    console.log(post.id);
    this.httpClient
      .put<{ message: string }>("http://localhost:3000/api/put", post)
      .subscribe((data) => {
        console.log(data);
        const updatedPost = [...this.postList];
        const oldPostIndex = updatedPost.findIndex((p) => p.id === post.id);
        updatedPost[oldPostIndex] = post;
        this.postList = updatedPost;
        this.postUpdated.next([...this.postList]);
      });
  }

  addPost(post: Post) {
    console.log(post);
    this.httpClient
      .post<{ id: string; message: string }>(
        "http://localhost:3000/api/post",
        post
      )
      .subscribe((data) => {
        console.log(data.id);
        post.id = data.id;
        this.postList.push(post);
        return this.postUpdated.next([...this.postList]);
      });
  }

  deletePost(id: string) {
    this.httpClient
      .delete("http://localhost:3000/api/posts/" + id)
      .subscribe((response) => {
        console.log(response);
        console.log(this.postList);
        this.postList.splice(
          this.postList.findIndex((e) => e.id === id),
          1
        );
        console.log(this.postList);
        return this.postUpdated.next([...this.postList]);
      });
  }
}
