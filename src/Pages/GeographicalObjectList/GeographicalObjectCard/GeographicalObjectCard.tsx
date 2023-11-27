import "./GeographicalObjectCard.sass"
import {GeographicalObject} from "../../../Types";
import {Link} from "react-router-dom";
import mockImage from "/src/assets/mock.png"

const GeographicalObjectCard = ({geographical_object, isMock}: { geographical_object: GeographicalObject, isMock: boolean }) => {

    const img = geographical_object.photo
    return (
        <div className="card-wrapper">
            <div className="preview">
                <img src={isMock ? mockImage : img} alt=""/>
            </div>
            <div className="card-content">
                <div className="content-top">
                    <h3 className="title"> {geographical_object.feature} </h3>
                </div>
                <div className="content-bottom">
                    <Link to={`/geographical_object/${geographical_object.id}`}>
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default GeographicalObjectCard;