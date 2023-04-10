import Login from "../pages/Login";

import { Route, Routes } from "react-router-dom";
import CreateEditPost from "../pages/Admin/CreateEditPost";
import RequireAuth from "../components/RequireAuth";
import Post from "../pages/Post";
import PostsList from "../pages/PostsList";
import CategoriesTable from "../pages/Admin/CategoriesTable";
import TagsTable from "../pages/Admin/TagsTable";
import CommentsTable from "../pages/Admin/CommentsTable";
import PostsTable from "../pages/Admin/PostsTable";
import Signup from "../pages/Signup";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PostsList />} />
      <Route path="/:id" element={<Post />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin/posts/create"
        element={
          <RequireAuth>
            <CreateEditPost />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/posts/:postId/comments"
        element={
          <RequireAuth>
            <CommentsTable />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/posts/edit/:id"
        element={
          <RequireAuth>
            <CreateEditPost />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/posts"
        element={
          <RequireAuth>
            <PostsTable />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <RequireAuth>
            <CategoriesTable />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/tags"
        element={
          <RequireAuth>
            <TagsTable />
          </RequireAuth>
        }
      />
    </Routes>
  );
};
