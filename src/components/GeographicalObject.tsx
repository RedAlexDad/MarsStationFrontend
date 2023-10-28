import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/card_item.css"
import {GET_GeographicalObject} from "../modules/GET_GeographicalObject.ts";

interface GeographicalObject {
    id: number;
    feature: string;
    type: string;
    size: number;
    describe: string;
    photo: string;
    status: boolean;
}

const GeographicalObject = () => {
    const { id } = useParams(); // Получаем значение параметра :id из URL
    const objectId = id ? parseInt(id, 10) : null; // Преобразование в число или null

    const [geographicalObject, setGeographicalObject] = useState<GeographicalObject | null>(null);

    useEffect(() => {
        if (objectId !== null) {
            GET_GeographicalObject(objectId)
                .then((result) => {
                    if (result.count > 0) {
                        // @ts-ignore
                        setGeographicalObject(result.data[0]);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching geographical object:', error);
                });
        }
    }, [objectId]);

    if (!geographicalObject) {
        return <div>Loading...</div>;
    }

    return (
        <div className="background-image">
            <div className="container-item">
                <div className="wrapper">
                    <img src={geographicalObject.photo} style={{ width: '30%', height: 'auto' }} alt={geographicalObject.feature} />
                    <h1>{geographicalObject.feature}</h1>
                    <p>Тип местности: {geographicalObject.type}</p>
                    <p>Площадь: {geographicalObject.size}</p>
                    {geographicalObject.describe && <p>Описание: {geographicalObject.describe}</p>}
                </div>
            </div>
        </div>
    );
};

export default GeographicalObject;
