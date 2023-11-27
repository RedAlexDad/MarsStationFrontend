import "./MarsStationList.sass"
// import SearchBar from "./SearchBar/SearchBar";
import {useEffect, useState} from "react";
import MarsStationCard from "./MarsStationCard/MarsStationCard.tsx";
import {DOMEN, requestTime} from "../../Consts";
import {MarsStation} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";

const MarsStationListPage = () => {
    const {access_token} = useToken()
    const [mars_stations, setMarsStation] = useState<MarsStation[]>([]);

    const searchMarsStation = async () => {
        try {

            // Определяем параметры запроса, включая номер страницы и количество объектов на странице
            // const params = new URLSearchParams({
            //     page: '1',
            //     status: 'True',
            //     feature: feature
            // });

            const response = await fetch(`${DOMEN}api/mars_station/`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'authorization': access_token
                },
                signal: AbortSignal.timeout(requestTime)
            })
            if (!response.ok) {
                return;
            }
            const mars_stations: MarsStation[] = await response.json()
            // @ts-ignore
            setMarsStation(mars_stations)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        searchMarsStation()
    }, [])

    const cards = mars_stations.map(mars_station => (
        <MarsStationCard mars_station={mars_station} key={mars_station.id}/>
    ))

    return (
        <div className="cards-list-wrapper">

            {/*<div className="top">*/}

            {/*<SearchBar feature={feature} setQuery={setFeature} />*/}

            {/*</div>*/}

            <div className="bottom">
                {cards}
            </div>
        </div>
    )
}

export default MarsStationListPage;