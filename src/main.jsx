import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Sửa dòng này:
import { BrowserRouter } from "react-router-dom"; // Thêm chữ "-dom" vào sau
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
