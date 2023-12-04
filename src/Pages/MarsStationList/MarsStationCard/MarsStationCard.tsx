import "./MarsStationCard.sass"
import {MarsStation} from "../../../Types";
import {Link} from "react-router-dom";
// import {STATUS_MISSIONS, STATUS_TASKS} from "../../../Consts.ts";

const MarsStationCard = ({mars_station}: { mars_station: MarsStation}) => {
        // const status_task = STATUS_TASKS.find(status => status.id === mars_station.status_task)?.name;
        // const status_mission = STATUS_MISSIONS.find(status => status.id === mars_station.status_mission)?.name;

        return (
        <div className="card-wrapper">
            <div className="card-content">
                <div className="content-top">
                    <h3 className="title"> {mars_station.type_status} </h3>
                </div>
                <div className={"group-info-wrapper"}>
                    <div className="group-info-details">
                        <p>Тип статуса заявки: {mars_station.status_task}</p>
                        <p>Статус состоянии: {mars_station.status_mission}</p>
                        <p>Дата создания: {mars_station.date_create}</p>
                        <p>Дата формирования: {mars_station.date_form}</p>
                        <p>Дата закрытия: {mars_station.date_close}</p>
                    </div>
                </div>

                <div className="content-bottom">
                    <Link to={`/mars_station/${mars_station.id}`}>
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MarsStationCard;