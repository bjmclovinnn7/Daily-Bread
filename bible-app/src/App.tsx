import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { UserContextProvider } from "./utils/UserContext";
import { VerseProvider } from "./utils/VerseContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
//Lazy Loaded
const Profile = lazy(() => import("./pages/Profile"));
const AllLoaded = lazy(() => import("./pages/Categories/AllLoaded"));
const Stage1 = lazy(() => import("./pages/Stage1"));
const Stage2 = lazy(() => import("./pages/Stage2"));
const Stage3 = lazy(() => import("./pages/Stage3"));
const Learned = lazy(() => import("./pages/Learned"));
const Friends = lazy(() => import("./pages/Friends"));
const FriendProfile = lazy(() => import("./pages/FriendProfile"));

function App() {
  return (
    <UserContextProvider>
      <VerseProvider>
        <Router>
          <Routes>
            <Route
              path="/auth"
              element={
                <Suspense
                  fallback={
                    <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                      Loading...
                    </div>
                  }
                >
                  <Auth />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense
                  fallback={
                    <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                      Loading...
                    </div>
                  }
                >
                  <Login />
                </Suspense>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <Home />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/all_verses"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <AllLoaded />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <Profile />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stage1"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <Stage1 />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stage2"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <Stage2 />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stage3"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <Stage3 />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learned"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <Learned />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <Friends />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/friendProfile"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 h-[100vh] w-full grid place-content-center font-Inter text-2xl">
                        Loading...
                      </div>
                    }
                  >
                    <FriendProfile />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </VerseProvider>
    </UserContextProvider>
  );
}

export default App;
