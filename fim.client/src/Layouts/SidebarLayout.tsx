import { useState, useEffect, useCallback } from "react";
import SideBar from "../Components/SidebarMenu";

type SideBarLayoutProps = {
    component: React.ReactNode;
}
interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}


export default function SideBarLayout(props: SideBarLayoutProps) {

    const [weather, setWeather] = useState<WeatherForecast[]>([]);
    //const [weatherId, setWeatherId] = useState<number>(0);

    //const getWeather = useCallback(async () => {
    //    const response = await fetch(`https://localhost:7035/WeatherForecast/${weatherId}`);
    //    console.log(response);
    //}, [weatherId])

    //const getWeatherBad = async () => {
    //    const response = await fetch(`https://localhost:7035/WeatherForecast/${weatherId}`);
    //    console.log(response);
    //};


    useEffect(() => {
        const loadWeather = async () => {
            try {
                //SpaProxy skickar automatiskt requesten till backend på rätt port
                const response = await fetch("https://localhost:7035/WeatherForecast");
                if (!response.ok) throw new Error("Failed to fetch API");
                const data: WeatherForecast[] = await response.json();
                setWeather(data);
                console.log(weather);
            } catch (error) {
                console.error("Error fetching weather:", error);
            }
        };
        loadWeather();
    }, []);

    
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <SideBar></SideBar>
            <div style={{flexGrow: 1}}>
                {props.component}
                {weather.map(w => w.temperatureC) }
            </div>
        </div>
    );
}