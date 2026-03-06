import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import ProtectedRoutes from "./protectedroute";
import Dashboard from "../pages/dashboard/dashboard";
import AdminLayout from "../components/layouts/adminlayout";
import AddMember from "../pages/members/addmember/addmember";
import MemberList from "../pages/members/memberlist/memberlist";

const AppRoutes = () => {
    return(
        <BrowserRouter>
          <Routes>
            <Route path="/" element = {<Login />}/>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoutes />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element = {<Dashboard />} />
                <Route path="/members/add" element = {<AddMember />}/>
                <Route path="/members" element={<MemberList />}></Route>
              </Route>
            </Route>
            
          </Routes>    
        </BrowserRouter>
    )
}

export default AppRoutes;