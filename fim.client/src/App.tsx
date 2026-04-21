import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SideBarLayout from './layouts/SidebarLayout';
import CreateSpool from './pages/CreateSpool';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import Signup from './pages/Signup';
import CreatePrint from './pages/CreatePrint';
import DashBoard from './pages/Dashboard'
import ActivePrints from './pages/ActivePrints'
import SpoolProvider from "@/components/context/AddSpoolContext"
import ProfilePage from './pages/ProfilePage';

export default function App() {
    return (
        <>
                <Routes>
                    <Route path="/" element={<SideBarLayout component={ <Home /> } />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route element={<ProtectedRoute />}>
                    <Route path="/create-spool" element={<SpoolProvider><SideBarLayout component={<CreateSpool />} /> </SpoolProvider> } />
                        <Route path="/create-print" element={<SideBarLayout component={<CreatePrint />} />} />
                        <Route path="/dashboard" element={<SideBarLayout component={<DashBoard />} />} />
                        <Route path="/activePrints" element={<SideBarLayout component={<ActivePrints />} />} />
                        <Route path="/profile" element={<SideBarLayout component={<ProfilePage />} />} />
                    </Route>
                 </Routes>
        </>
    );
}
//Usestate useeffect

