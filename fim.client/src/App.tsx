import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SideBarLayout from './Layouts/SidebarLayout';
import CreateSpool from './Pages/CreateSpool';
import CreatePrint from './Pages/CreatePrint'


export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<SideBarLayout component={ <Home /> } />} />
                <Route path="/create-spool" element={<SideBarLayout component={<CreateSpool />} />} />
                <Route path="/create-print" element={<SideBarLayout component={<CreatePrint />} />} />
                
            </Routes>
        </>
    );
}
//Usestate useeffect

