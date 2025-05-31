import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AuthContext from "./context/AuthContext";
import InfoCard from "./components/InfoCard/InfoCard";
// import Button from "./components/Button/Button";

function App() {
    const { verified, user } = useContext(AuthContext);
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
            {user && !verified && showInfoCard && (
                <section>
                    <InfoCard
                        style="verify"
                        text={`An email was sent to your email, you need to verify before you can start adding media to your watchlist.`}
                    />
                    <InfoCard
                        style="verify"
                        text={`If you didn't receive the email, please check your spam folder or click on the verify button in settings to resend it.`}
                    />
                </section>
            )}
            <main className="wrapper">
                <Outlet />
            </main>
        </>
    );
}

export default App;
