import "./GeographicalObject.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {DOMEN, GeographicalObjectsMock, requestTime} from "../../../Consts";
import {GeographicalObject} from "../../../Types";
import mockImage from "/src/assets/mock.png"

const GeographicalObjectPageForMarsStation = ({selectedGeographicalObject, setSelectedGeographicalObject}: { selectedGeographicalObject: GeographicalObject | undefined, setSelectedGeographicalObject: Dispatch<GeographicalObject | undefined> }) => {

    const {id} = useParams<{ id: string }>();
    const [isMock, setIsMock] = useState<boolean>(false);

    useEffect(() => {
        fetchData()
    }, [])

    if (id == undefined) {
        return;
    }

    const fetchData = async () => {

        try {
            const response = await fetch(`${DOMEN}api/geographical_object/${id}/`, {
                method: "GET",
                signal: AbortSignal.timeout(requestTime)
            });

            if (!response.ok) {
                CreateMock()
                return;
            }

            const geographical_object: GeographicalObject = await response.json()

            setSelectedGeographicalObject(geographical_object)

            setIsMock(false)
        } catch {
            CreateMock()
        }

    };

    const CreateMock = () => {
        setSelectedGeographicalObject(GeographicalObjectsMock.find((service: GeographicalObject) => service?.id == parseInt(id)))
        setIsMock(true)
    }

    const img = selectedGeographicalObject?.photo

    return (
        <div className="page-details-wrapper">
            <Link className="return-link" to={`/mars_station/${id}`}>
                Назад
            </Link>
            <div className="left">
                <img src={isMock ? mockImage : img} alt=""/>
            </div>
            <div className="right">
                <div className="info-container">
                    <h2 className="name">{selectedGeographicalObject?.feature}</h2>
                    <br/>
                    <span className="type">Тип местности: {selectedGeographicalObject?.type}г</span>
                    <br/>
                    <span className="size">Площадь: {selectedGeographicalObject?.size} млн</span>
                    <br/>
                    <span className="describe"> {selectedGeographicalObject?.describe} км^2</span>
                </div>
            </div>
        </div>
    )
}

export default GeographicalObjectPageForMarsStation;