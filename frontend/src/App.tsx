import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./pages/Auth/ResetPassword/ResetPassword";
import LoginPage from "./pages/Auth/Login/Login";
import SignupPage from "./pages/Auth/Signup/Signup";
import styles from "./scss/App.module.scss";
import SetNewPasswordPage from "./pages/Auth/SetNewPassword/SetNewPassword";
import Header from "./components/Header/Header";
import FeedPage from "./pages/Feed/Feed";
import AddPost from "./components/CreatePost/CreatePost";
import ReactDOM from "react-dom";
import { AddPostContext } from "./contexts/AddPostContext";
import { useState } from "react";
import { PostsContext } from "./contexts/PostsContext";
import { IPost } from "./types/post";
import { DeletePostContext } from "./contexts/DeletePostContext";
import { PostIdContext } from "./contexts/PostIdContext";
import DeletePost from "./components/ConfirmationModals/DeletePost";

function App() {
  const [addPost, setAddPost] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postId, setPostId] = useState(""); //postId to be manipulated
  return (
    <BrowserRouter>
      <PostIdContext.Provider value={{ postId, setPostId }}>
        <DeletePostContext.Provider value={{ deletePost, setDeletePost }}>
          <AddPostContext.Provider value={{ addPost, setAddPost }}>
            <PostsContext.Provider value={{ posts, setPosts }}>
              <div className={styles.app}>
                <Routes>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="signup" element={<SignupPage />} />
                  <Route
                    path="reset-password"
                    element={<ResetPasswordPage />}
                  />
                  <Route path="reset/:token" element={<SetNewPasswordPage />} />
                  <Route path="" element={<Header />}>
                    <Route path="" element={<FeedPage />} />
                  </Route>
                </Routes>
                {addPost &&
                  ReactDOM.createPortal(
                    <AddPost />,
                    document.getElementById("modal") as HTMLElement
                  )}
                {deletePost &&
                  ReactDOM.createPortal(
                    <DeletePost postId={postId} />,
                    document.getElementById("modal") as HTMLElement
                  )}
              </div>
            </PostsContext.Provider>
          </AddPostContext.Provider>
        </DeletePostContext.Provider>
      </PostIdContext.Provider>
    </BrowserRouter>
  );
}

export default App;
