import SideBar from "../components/SidebarMenu";

type SideBarLayoutProps = {
    component: React.ReactNode;
}

export default function SideBarLayout(props: SideBarLayoutProps) {    
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            width: "100vw",
            overflowX: "hidden"
        }}>
            <SideBar></SideBar>
            <div style={{
                flexGrow: 1,
                minWidth: "0"
            }}>
                {props.component}
            </div>
        </div>
    );
}