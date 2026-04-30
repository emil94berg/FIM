import { useState } from "react";
import SideBar from "../components/SidebarMenu";
import AppHeader from "@/layouts/AppHeader"

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
            <SideBar open={open} setOpen={setOpen} ></SideBar>
            <AppHeader></AppHeader>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                
                <main
                    className="pt-16"
                    style={{
                    marginLeft: open ? "12rem" : "3rem",
                    transition: "margin 0.3s"
                }}>
                    {props.component}
                </main>
            </div>
        </div>
    );
}
