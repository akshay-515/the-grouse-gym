import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import ProtectedRoutes from "./protectedroute";
import Dashboard from "../pages/dashboard";
import AdminLayout from "../components/layouts/adminlayout";

const AppRoutes = () => {
    return(
        <BrowserRouter>
          <Routes>
            <Route path="/" element = {<Login />}/>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoutes />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element = {<Dashboard />} />
              </Route>
            </Route>
          </Routes>    
        </BrowserRouter>
    )
}

export default AppRoutes;