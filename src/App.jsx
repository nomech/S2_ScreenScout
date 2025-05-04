import { Outlet } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import { authContext } from "./context/authContext";

function App() {
  const user = useContext(authContext);
  console.log(user);
  console.log(user.displayname);
  

  return <Outlet />;
}

export default App;
