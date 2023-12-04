import "./GeographicalObject.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {DOMEN, GeographicalObjectsMock, requestTime} from "../../Consts";
import {GeographicalObject} from "../../Types";
import mockImage from "/src/assets/mock.png"
import axios from "axios";

const GeographicalObjectPage = ({selectedGeographicalObject, setSelectedGeographicalObject}: {
    selectedGeographicalObject: GeographicalObject | undefined,
    setSelectedGeographicalObject: Dispatch<GeographicalObject | undefined>
}) => {

    const {id_geographical_object} = useParams<{ id_geographical_object: string }>();
    const [isMock, setIsMock] = useState<boolean>(false);

    useEffect(() => {
        GetGeographicalObhectID()
    }, [])

    if (id_geographical_object == undefined) {
        return;
    }

    const GetGeographicalObhectID = async () => {
        const url = `${DOMEN}api/geographical_object/${id_geographical_object}/`;
        await axios.get(url, {
            timeout: requestTime,
        })
            .then(response => {
                const geographicalObject: GeographicalObject = response.data;
                setSelectedGeographicalObject(geographicalObject);
                setIsMock(false);
            })
            .catch(error => {
                console.error(error);
                CreateMock();
            });
    };

    const CreateMock = () => {
        setSelectedGeographicalObject(GeographicalObjectsMock.find((service: GeographicalObject) => service?.id == parseInt(id_geographical_object)))
        setIsMock(true)
    }

    const img = selectedGeographicalObject?.photo

    return (
        <div className="page-details-wrapper">
            <Link className="return-link" to="/geographical_object">
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
                    <span className="size">Площадь: {selectedGeographicalObject?.size}</span>
                    <br/>
                    <span className="describe"> {selectedGeographicalObject?.describe}</span>
                </div>
            </div>
        </div>
    )
}

export default GeographicalObjectPage;