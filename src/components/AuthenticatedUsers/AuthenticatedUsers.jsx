import { getAuthContext } from "../../context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "../Loading/Loading";

//This component checks if the user is authenticated
//If the user is authenticated, it renders the children components

const AuthenticatedUsers = ({ children }) => {
    // Gets the user and isLoading state from the authContext
    const { user, isLoading } = getAuthContext();

    // If the user is loading, it shows a loading spinner
    if (isLoading) {
        return <Loading />;
    }

    // If the user is not authenticated and not loading, it redirects to the login page
    if (!user && !isLoading) {
        return <Navigate to="/login" />;
    }

    // If the user is authenticated, it renders the children components
    return children;
};

export default AuthenticatedUsers;
