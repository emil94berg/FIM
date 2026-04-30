import SideBar from "../components/SidebarMenu";
import AppHeader from "@/layouts/AppHeader"

type SideBarLayoutProps = {
    component: React.ReactNode;
}

export default function SideBarLayout(props: SideBarLayoutProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            minHeight: "100vh",
            overflowX: "hidden"
        }}>
            <SideBar></SideBar>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <AppHeader></AppHeader>
                <main style={{
                    flexGrow: 1,
                    minWidth: 0,
                    padding: "1rem"
                }}>
                    {props.component}
                </main>
            </div>
            
        </div>
    );
}
