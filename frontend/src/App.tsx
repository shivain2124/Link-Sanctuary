import { useState } from "react";
import HomePage from "./pages/home/home";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { FolderProvider, useFolder } from "./context/folder-context";
import { Search } from "lucide-react";
import { searchService } from "./services/link-service";

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const { setActiveFolderLinks, setIsGlobalSearch, setActiveFolderId } =
    useFolder();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsGlobalSearch(true);
    setActiveFolderId(null); // Deselect current folder
    const results = await searchService({ q: query });
    setActiveFolderLinks(results.data || []);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-xs md:max-w-md mx-4"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
      <input
        type="text"
        placeholder="Global search..."
        className="input input-sm input-bordered w-full pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

function App() {
  return (
    <FolderProvider>
      <Router>
        <SignedIn>
          <header className="p-4 flex justify-between items-center bg-base-200 border-b border-base-300">
            <h1 className="text-xl  text-gray-700 font-bold hidden md:block">
              LINK SANCTUARY
            </h1>
            <GlobalSearch />
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
      <Toaster position="top-right" />
    </FolderProvider>
  );
}

export default App;
