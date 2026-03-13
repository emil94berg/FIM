import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SideBarLayout from './Layouts/SidebarLayout';
import CreateSpool from './Pages/CreateSpool';


export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<SideBarLayout component={ <Home /> } />} />
<Route path="/create-spool" element={<SideBarLayout component={ <CreateSpool /> } />} />
            </Routes>
        </>
    );
}
//Usestate useeffect

