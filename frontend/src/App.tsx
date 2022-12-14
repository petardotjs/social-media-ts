import ReactDOM from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ResetPasswordPage from "./pages/Auth/ResetPassword/ResetPassword";
import LoginPage from "./pages/Auth/Login/Login";
import SignupPage from "./pages/Auth/Signup/Signup";
import styles from "./scss/App.module.scss";
import SetNewPasswordPage from "./pages/Auth/SetNewPassword/SetNewPassword";
import Header from "./components/Header/Header";
import FeedPage from "./pages/Feed/Feed";
import AddPost from "./components/CreatePost/CreatePost";
import { ModalsManipulationContext } from "./contexts/ModalsManipulationContext";
import { PostsContext } from "./contexts/PostsContext";
import { IPost } from "./types/feed";
import { PostIdContext } from "./contexts/PostIdContext";
import ConfirmationModal from "./components/ConfirmationModalBuilder/ConfirmationModalBuilder";
import ReportPost from "./components/ReportPost/ReportPost";
import { FlashMessageContext } from "./contexts/FlashMessageFeedContext";
import User from "./pages/User/User";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/MobileMenu/MobileMenu";
import { SwitchThemeContext } from "./contexts/SwitchThemeContext";

export const useClearFlash = () => {
  const [isFeedFlashMessage, setIsFeedFlashMessage] = useState(false);
  const [feedFlashMessageConfiguration, setFeedFlashMessageConfiguration] =
    useState<{ text: string; color: "red" | "green" }>({
      text: "",
      color: "red",
    });
  const [activeFlashTimeout, setActiveFlashTimeout] = useState<
    number | NodeJS.Timeout
  >(0);

  useEffect(() => {
    if (isFeedFlashMessage) {
      clearTimeout(activeFlashTimeout);
      const timeout = setTimeout(() => {
        setIsFeedFlashMessage(false);
      }, 5000);
      setActiveFlashTimeout(timeout);
    }
  }, [isFeedFlashMessage]);

  return {
    activeFlashTimeout,
    setActiveFlashTimeout,
    isFeedFlashMessage,
    setIsFeedFlashMessage,
    feedFlashMessageConfiguration,
    setFeedFlashMessageConfiguration,
  };
};

function App() {
  const {
    setFeedFlashMessageConfiguration,
    feedFlashMessageConfiguration,
    isFeedFlashMessage,
    setIsFeedFlashMessage,
    activeFlashTimeout,
    setActiveFlashTimeout,
  } = useClearFlash();
  const [isNavigatingToFeed, setIsNavigatingToFeed] = useState(false); //prevent re-render of the feed on navigate
  const [addPostVisibility, setAddPostVisibility] = useState(false);
  const [deletePostVisibility, setDeletePostVisibility] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postId, setPostId] = useState(""); //postId to be manipulated
  const [confirmClosingAddPostVisibility, setConfirmClosingAddPostVisibility] =
    useState(false);
  const [
    confirmClosingReportPostVisibility,
    setConfirmClosingReportPostVisibility,
  ] = useState(false);
  const [
    confirmClosingEditPostVisibility,
    setConfirmClosingEditPostVisibility,
  ] = useState(false);
  const [reportPostVisibility, setReportPostVisibility] = useState(false);
  const [editPostVisibility, setEditPostVisibility] = useState(false);
  const [postToEdit, setPostToEdit] = useState<IPost | null>(null);
  const [sortBy, setSortBy] = useState<"RECENCY" | "VOTES">("RECENCY");
  const [areSuggestionsVisible, setAreSuggestionsVisible] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const setEditPost = useCallback(async () => {
    if (editPostVisibility) {
      const res = await fetch(`http://localhost:8080/posts/${postId}`);
      const resData = await res.json();
      setPostToEdit(resData.post);
    } else {
      setPostToEdit(null);
    }
  }, [editPostVisibility, postId]);

  useEffect(() => {
    setEditPost();
  }, [setEditPost]);

  const [devRole, setDevRole] = useState<"FRONTEND" | "BACKEND" | "DEVOPS">(
    "FRONTEND"
  );
  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
  }, []);

  const fetchAvatar = useCallback(async () => {
    const res = await fetch(
      `http://localhost:8080/users/${localStorage.getItem("userId")}/avatar`
    );
    if (res.status === 200) {
      const { avatarUrl } = await res.json();
      setUserAvatar(avatarUrl);
    } else {
      setFeedFlashMessageConfiguration({
        text: "Something went wrong.",
        color: "red",
      });
      setIsFeedFlashMessage(true);
      clearTimeout(activeFlashTimeout);
      const timeout = setTimeout(() => {
        setIsFeedFlashMessage(false);
      }, 5000);
      setActiveFlashTimeout(timeout);
    }
  }, [
    activeFlashTimeout,
    setActiveFlashTimeout,
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
  ]);

  useEffect(() => {
    fetchAvatar();
  }, [fetchAvatar]);

  return (
    <BrowserRouter>
      <SwitchThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        <FlashMessageContext.Provider
          value={{
            feedFlashMessageConfiguration,
            isFeedFlashMessage,
            setFeedFlashMessageConfiguration,
            setIsFeedFlashMessage,
            activeFlashTimeout,
            setActiveFlashTimeout,
            isLoader,
            setIsLoader,
          }}
        >
          <PostIdContext.Provider value={{ postId, setPostId }}>
            <ModalsManipulationContext.Provider
              value={{
                addPostVisibility,
                setAddPostVisibility,
                deletePostVisibility,
                setDeletePostVisibility,
                reportPostVisibility,
                setReportPostVisibility,
                editPostVisibility,
                setEditPostVisibility,
              }}
            >
              <PostsContext.Provider
                value={{
                  posts,
                  setPosts,
                  sortBy,
                  setSortBy,
                  devRole,
                  setDevRole,
                }}
              >
                <div
                  className={styles.app + " " + (isDarkMode && styles.darkMode)}
                  id="app"
                  onClick={() => {
                    setAreSuggestionsVisible(false);
                  }}
                >
                  <>
                    <Routes>
                      <Route path="login" element={<LoginPage />} />
                      <Route path="signup" element={<SignupPage />} />
                      <Route
                        path="reset-password"
                        element={<ResetPasswordPage />}
                      />
                      <Route
                        path="reset/:token"
                        element={<SetNewPasswordPage />}
                      />
                      <Route
                        path=""
                        element={
                          <Header
                            setIsNavigatingToFeed={setIsNavigatingToFeed}
                            areSuggestionsVisible={areSuggestionsVisible}
                            setAreSuggestionsVisible={setAreSuggestionsVisible}
                            userAvatar={userAvatar}
                            isDarkMode={isDarkMode}
                          />
                        }
                      >
                        <Route path="" element={<Footer />}>
                          <Route
                            path=""
                            element={<NavBar userAvatar={userAvatar} />}
                          >
                            <Route
                              path=""
                              element={
                                <FeedPage
                                  isNavigatingToFeed={isNavigatingToFeed}
                                  setIsNavigatingToFeed={setIsNavigatingToFeed}
                                  userAvatar={userAvatar}
                                />
                              }
                            />
                            <Route
                              path="user/:userId"
                              element={
                                <User
                                  userAvatar={userAvatar}
                                  setUserAvatar={setUserAvatar}
                                />
                              }
                            />
                          </Route>
                        </Route>
                      </Route>
                    </Routes>
                    {reportPostVisibility &&
                      ReactDOM.createPortal(
                        <ReportPost
                          setClosingConfirmationVisibility={
                            setConfirmClosingReportPostVisibility
                          }
                        />,
                        document.getElementById("modal") as HTMLElement
                      )}
                    {addPostVisibility &&
                      ReactDOM.createPortal(
                        <AddPost
                          setClosingConfirmationVisibility={
                            setConfirmClosingAddPostVisibility
                          }
                        />,
                        document.getElementById("modal") as HTMLElement
                      )}
                    {deletePostVisibility &&
                      ReactDOM.createPortal(
                        <ConfirmationModal
                          question="Are you sure you want to delete this post?"
                          onConfirmation={async () => {
                            try {
                              setIsLoader(true);
                              const res = await fetch(
                                `http://localhost:8080/posts/${postId}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization:
                                      "Bearer " + localStorage.getItem("token"),
                                  },
                                }
                              );
                              setIsLoader(false);
                              if (res.status === 200) {
                                setPosts((posts) =>
                                  posts.filter((post) => post._id !== postId)
                                );
                                setDeletePostVisibility(false);
                                setIsFeedFlashMessage(true);
                                setFeedFlashMessageConfiguration({
                                  text: "Post was successfully deleted.",
                                  color: "green",
                                });
                                setTimeout(() => {
                                  setIsFeedFlashMessage(false);
                                }, 5000);
                              } else {
                                const resData = await res.json();
                                setIsFeedFlashMessage(true);
                                setFeedFlashMessageConfiguration({
                                  text: resData.message,
                                  color: "red",
                                });
                                setTimeout(() => {
                                  setIsFeedFlashMessage(false);
                                }, 5000);
                              }
                            } catch (error) {
                              setIsFeedFlashMessage(true);
                              setFeedFlashMessageConfiguration({
                                text: "Something went wrong. Please, try again later.",
                                color: "red",
                              });
                              setTimeout(() => {
                                setIsFeedFlashMessage(false);
                              }, 5000);
                            }
                          }}
                          setVisibility={setDeletePostVisibility}
                        />,
                        document.getElementById("modal") as HTMLElement
                      )}
                    {editPostVisibility &&
                      postToEdit &&
                      ReactDOM.createPortal(
                        <AddPost
                          editPost
                          postToEdit={postToEdit}
                          setClosingConfirmationVisibility={
                            setConfirmClosingEditPostVisibility
                          }
                        />,
                        document.getElementById("modal") as HTMLElement
                      )}
                    {confirmClosingAddPostVisibility &&
                      ReactDOM.createPortal(
                        <ConfirmationModal
                          question="Are you sure you want to close this modal?"
                          onConfirmation={() => {
                            setAddPostVisibility(false);
                          }}
                          setVisibility={setConfirmClosingAddPostVisibility}
                        />,
                        document.getElementById(
                          "confirm-closing-modal"
                        ) as HTMLElement
                      )}
                    {confirmClosingReportPostVisibility &&
                      ReactDOM.createPortal(
                        <ConfirmationModal
                          question="Are you sure you want to close this modal?"
                          onConfirmation={() => {
                            setReportPostVisibility(false);
                          }}
                          setVisibility={setConfirmClosingReportPostVisibility}
                        />,
                        document.getElementById(
                          "confirm-closing-modal"
                        ) as HTMLElement
                      )}
                    {confirmClosingEditPostVisibility &&
                      ReactDOM.createPortal(
                        <ConfirmationModal
                          question="Are you sure you want to close this modal?"
                          onConfirmation={() => {
                            setEditPostVisibility(false);
                          }}
                          setVisibility={setConfirmClosingEditPostVisibility}
                        />,
                        document.getElementById(
                          "confirm-closing-modal"
                        ) as HTMLElement
                      )}
                  </>
                </div>
              </PostsContext.Provider>
            </ModalsManipulationContext.Provider>
          </PostIdContext.Provider>
        </FlashMessageContext.Provider>
      </SwitchThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
