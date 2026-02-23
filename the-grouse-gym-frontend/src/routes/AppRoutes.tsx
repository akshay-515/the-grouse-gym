import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";

export default function AppRoutes() {
    return(
        <BrowserRouter>
          <Routes>
            <Route path="/" element = {<Login />}/>
          </Routes>    
        </BrowserRouter>
    )
}