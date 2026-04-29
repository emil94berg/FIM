import SideBar from "../components/SidebarMenu";

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
            <main style={{
                flexGrow: 1,
                minWidth: 0,
                padding: "1rem"
            }}>
                {props.component}
            </main>
        </div>
    );
}
