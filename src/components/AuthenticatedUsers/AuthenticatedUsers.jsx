import React, { useContext } from "react";
import { authContext } from "../../context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const AuthenticatedUsers = ({ children }) => {
    const { user, isLoading } = useContext(authContext);
    if (isLoading) {
        <Loading />;
    }
    if (!user && !isLoading) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AuthenticatedUsers;
