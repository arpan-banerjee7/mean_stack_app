import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PostService {
  constructor(private httpClient: HttpClient) {}
  private postList: Post[] = [];

  private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPosts(pageSize: Number, currentPage: Number) {
    console.log(pageSize);
    console.log("current page : " + currentPage);
    this.httpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        `http://localhost:3000/api/posts?pagesize=${pageSize}&page=${currentPage}`
      )
      .pipe(
        map((data) => {
          return {
            posts: data.posts.map((data) => {
              return {
                title: data.title,
                content: data.content,
                id: data._id,
                imagePath: data.imagePath,
              };
            }),
            maxPosts: data.maxPosts,
          };
        })
      )
      .subscribe((data) => {
        this.postList = data.posts;
        console.log(data);
        this.postUpdated.next({
          posts: [...this.postList],
          postCount: data.maxPosts,
        });
      });
  }

  getPost(id: string) {
    return this.httpClient
      .get<{ message: string; post: Post }>(
        `http://localhost:3000/api/post/${id}`
      )
      .pipe(
        map((data) => {
          console.log(data.message);
          return data.post;
        })
      );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    console.log(postData);

    this.httpClient
      .post<{ post: Post; message: string }>(
        "http://localhost:3000/api/post",
        postData
      )
      .subscribe((data) => {
        const post: Post = {
          id: data.post.id,
          title: title,
          content: content,
          imagePath: data.post.imagePath,
        };
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.httpClient
      .put<{ message: string }>("http://localhost:3000/api/put", postData)
      .subscribe((data) => {
        // console.log(data);
        // const updatedPost = [...this.postList];
        // const oldPostIndex = updatedPost.findIndex((p) => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: "",
        // };
        // updatedPost[oldPostIndex] = post;
        // this.postList = updatedPost;
        // this.postUpdated.next([...this.postList]);
      });
  }

  deletePost(id: string) {
    return this.httpClient.delete("http://localhost:3000/api/posts/" + id);
    // .subscribe((response) => {
    //   console.log(response);
    //   console.log(this.postList);
    //   this.postList.splice(
    //     this.postList.findIndex((e) => e.id === id),
    //     1
    //   );
    //   console.log(this.postList);
    //   return this.postUpdated.next([...this.postList]);
    // });
  }
}
