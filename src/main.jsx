import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { GenreProvider } from "./context/genreContext.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <GenreProvider>
            <RouterProvider router={routes} />
        </GenreProvider>
    </AuthProvider>
);
