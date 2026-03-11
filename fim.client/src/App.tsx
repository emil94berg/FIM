import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SideBarLayout from './Layouts/SidebarLayout';


export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<SideBarLayout component={ <Home /> } />} />
            </Routes>
        </>
    );
}
//Usestate useeffect

