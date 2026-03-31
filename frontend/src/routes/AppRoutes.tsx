import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "../pages/login/login";
import ProtectedRoutes from "./protectedroute";
import Dashboard from "../pages/dashboard/dashboard";
import AdminLayout from "../components/adminlayout";
import AddMember from "../pages/members/addmember/addmember";
import MemberList from "../pages/members/memberlist/memberlist";
import EditMember from "../pages/members/updatemember/updatemember";
import Memberships from "../pages/memberships/memberships";
import Payments from "../pages/payments/payments";
import ExpiringMembers from "../pages/expiring/expiring";
import PaymentList from "../pages/paymentList/paymentList";

const AppRoutes = () => {
    return(
        <BrowserRouter>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element = {<Login />}/>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoutes />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element = {<Dashboard />} />
                <Route path="/members/add" element = {<AddMember />}/>
                <Route path="/members" element={<MemberList />} />
                <Route path="/members/edit/:id" element={<EditMember />}/>
                <Route path="/payments" element={<Payments />}/>
                <Route path="/memberships" element={<Memberships />}/>
                <Route path="/expiring" element={<ExpiringMembers />}/>
                <Route path="/payments-list" element={<PaymentList />} />
              </Route>
            </Route>
            
          </Routes>    
        </BrowserRouter> 
    )
}

export default AppRoutes;