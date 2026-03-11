import { useState } from "react";
import SideBar from "../Components/SidebarMenu";

type SideBarLayoutProps = {
    component: React.ReactNode;
}

export default function SideBarLayout(props: SideBarLayoutProps) {
    
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <SideBar></SideBar>
            <div style={{flexGrow: 1}}>
                {props.component}
            </div>
        </div>
    );
}