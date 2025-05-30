import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GenreProvider } from "./context/GenreContext.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <GenreProvider>
            <RouterProvider router={routes} />
        </GenreProvider>
    </AuthProvider>
);
