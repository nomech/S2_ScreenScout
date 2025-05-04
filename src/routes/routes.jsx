import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import App from "../App";
import ForgotPasswordCard from "../components/ForgotPasswordCard/ForgotPasswordCard";

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<App />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordCard />} />
        <Route
          path="*"
          element={<div> Yeah.... Thats not a thing here </div>}
        />
      </Route>
    </>
  )
);
