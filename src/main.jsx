import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Sửa dòng này:
import { BrowserRouter } from "react-router-dom"; // Thêm chữ "-dom" vào sau
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById("root")).render(
   <StrictMode>
    {/* Bọc ngoài cùng để toàn bộ App có thể dùng logic Login Google */}
    <GoogleOAuthProvider clientId="75755582931-9qk7il13h3pq4pgoq1chkrb1opoveot3.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
