import HomePage from "./pages/home/home";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { FolderProvider } from "./context/folder-context";

function App() {
  return (
    <>
      <FolderProvider>
        <Router>
          <SignedIn>
            <header className="p-4 flex justify-between items-center bg-base-200">
              <h1 className="text-xl font-bold">Link Sanctuary</h1>
              <UserButton />
            </header>
          </SignedIn>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <HomePage />
                  </SignedIn>

                  <SignedOut>
                    <div className="flex items-center justify-center min-h-screen">
                      <SignInButton mode="modal">
                        <button className="btn btn-primary">Sign In</button>
                      </SignInButton>
                    </div>
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </Router>
      </FolderProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
