import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import HomePage from "./pages/home/home";
import { Toaster } from "react-hot-toast";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
