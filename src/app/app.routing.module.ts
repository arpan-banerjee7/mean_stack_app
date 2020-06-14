import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

const appRoutes: Routes = [
  { path: "", component: PostListComponent },
  { path: "list", component: PostListComponent },
  { path: "create", component: PostCreateComponent },
  { path: "edit/:id", component: PostCreateComponent },
  { path: "**", redirectTo: "list" },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
