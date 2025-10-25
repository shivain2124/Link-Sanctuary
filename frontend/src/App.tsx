import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { FolderTree } from "../src/components/folder/file-tree";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<FolderTree />} />
      </Routes>
    </Router>
  );
}

export default App;
