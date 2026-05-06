import { Routes, Route } from 'react-router-dom';
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
import { Toaster } from "@/components/ui/sonner"
import ForumHomePage from './pages/ForumHomePage'
import ForumPost from '@/pages/ForumPost'
import CreateForumPostPage from '@/pages/CreateForumPostPage'
import InfoPage from '@/pages/InfoPage';


export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<SideBarLayout component={<InfoPage /> } />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/info" element={<SideBarLayout component={< InfoPage />} />} />
                <Route element={<ProtectedRoute />}>
                <Route path="/handle-spools" element={<SpoolProvider><SideBarLayout component={<CreateSpool />} /> </SpoolProvider> } />
                    <Route path="/handle-prints" element={<SideBarLayout component={<CreatePrint />} />} />
                    <Route path="/dashboard" element={<SideBarLayout component={<DashBoard />} />} />
                    <Route path="/active-prints" element={<SideBarLayout component={<ActivePrints />} />} />
                    <Route path="/profile" element={<SideBarLayout component={<ProfilePage />} />} />
                    <Route path="/forum" element={<SideBarLayout component={<ForumHomePage />} />} />
                    <Route path="/forum/create" element={<SideBarLayout component={<CreateForumPostPage />} />} />
                    <Route path="/forum/post/:id" element={<SideBarLayout component={< ForumPost />} />} />
                    
                </Route>
            </Routes>
            <Toaster richColors closeButton position="top-right" />
        </>
    );
}
//Usestate useeffect

