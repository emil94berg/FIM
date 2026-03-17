import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SideBarLayout from './Layouts/SidebarLayout';
import CreateSpool from './Pages/CreateSpool';
import Login from './Pages/Login';
import { ProtectedRoute } from './Components/ProtectedRoute';
import Signup from './Pages/Signup';

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<SideBarLayout component={ <Home /> } />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/create-spool" element={<SideBarLayout component={ <CreateSpool /> } />} />
                </Route>
            </Routes>
        </>
    );
}
//Usestate useeffect

