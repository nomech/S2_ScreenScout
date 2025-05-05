import { Outlet } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import { authContext } from "./context/authContext";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const user = useContext(authContext);
  console.log(user);
  console.log(user.displayname);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
