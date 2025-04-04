import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "pages/home";
import ProfilePage from "pages/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
