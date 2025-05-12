import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import App from "../App";
import Home from "../pages/Home";
import AuthenticatedUsers from "../components/AuthenticatedUsers/AuthenticatedUsers";
import ForgotPasswordCard from "../components/ForgotPasswordCard/ForgotPasswordCard";
import NotFound from "../components/NotFound/NotFound";
import Search from "../pages/Search";

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<App />}>
                <Route
                    index
                    element={
                        <AuthenticatedUsers>
                            <Home />
                        </AuthenticatedUsers>
                    }
                    exact
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordCard />}
                />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </>
    )
);
