import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { authContext } from "./context/authContext";
import InfoCard from "./components/InfoCard/InfoCard";
// import Button from "./components/Button/Button";

function App() {
    const { verified } = useContext(authContext);
    const [showInfoCard, setShowInfoCard] = useState(false);

    useEffect(() => {
        let timeOut;
        if (!verified) {
            timeOut = setTimeout(() => {
                setShowInfoCard(true);
            }, 2000);
        }
        return () => clearTimeout(timeOut);
    }, [verified]);

    return (
        <>
            <Navbar />
            {!verified && showInfoCard && (
                <InfoCard
                    style="verify"
                    text="An email was sent to your email, you need to verify before you can start adding media to your watchlist"
                />
            )}

            <Outlet />
        </>
    );
}

export default App;
