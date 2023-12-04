import "./MarsStationList.sass"
import {useEffect, useState} from "react";
import MarsStationCard from "./MarsStationCard/MarsStationCard.tsx";
import {DOMEN, requestTime} from "../../Consts";
import {MarsStation} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth.ts";

const MarsStationListPage = () => {
    const {access_token} = useToken()
    const [mars_stations, setMarsStation] = useState<MarsStation[]>([]);
    const {is_moderator} = useAuth()

    const searchMarsStation = async () => {
        let params;
        if (is_moderator){
            params = new URLSearchParams({
                // Список заявок кроме со статусом 5
                status_task: '2; 3; 4',
            });
        } else {
            params = new URLSearchParams({
                // Список заявок кроме со статусом 5
                status_task: '1; 2; 3; 4',
            });
        }
        const url = `${DOMEN}api/mars_station/?${params}`;
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
            timeout: requestTime,
        })
            .then(response => {
                const mars_stations: MarsStation[] = response.data;
                // @ts-ignore
                setMarsStation(mars_stations);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            });
    };

    useEffect(() => {
        searchMarsStation()
    }, [])

    const cards = mars_stations.map(mars_station => (
        // @ts-ignore
        <MarsStationCard mars_station={mars_station} key={mars_station.id}/>
    ))

    return (
        <div className="cards-list-wrapper">
            <div className="bottom">
                {cards}
            </div>
        </div>
    )
}

export default MarsStationListPage;