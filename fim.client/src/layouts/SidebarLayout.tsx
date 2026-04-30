import { useState } from "react";
import SideBar from "../components/SidebarMenu";

type SideBarLayoutProps = {
    component: React.ReactNode;
}

export default function SideBarLayout(props: SideBarLayoutProps) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{
            width: "100%",
            minHeight: "100vh",
            overflowX: "hidden"
        }}>
            <SideBar open={open} setOpen={setOpen}></SideBar>
            <main style={{
                marginLeft: open ? "12rem" : "3rem",
                padding: "1rem",
                transition: "margin 0.3s"
            }}>
                {props.component}
            </main>
        </div>
    );
}
