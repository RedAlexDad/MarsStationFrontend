import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/card_item.css"

interface GeographicalObject {
    id: number;
    feature: string;
    type: string;
    size: number;
    describe: string;
    url_photo: string;
    status: boolean;
}

const GeographicalObjects: React.FC<{ data: GeographicalObject; handleDelete: (id: number) => void }> = ({ data, handleDelete }) => {
    return (
        <div className="container-item" key={data.id}>
            <div className="wrapper">
                <img src={data.url_photo} style={{width: 'auto', height: '50%'}}/>
                <p>{data.feature}</p>
            </div>
            <div className="button-wrapper">
                <input type="text" name="id" value={data.id} style={{display: 'none'}}/>
                <button className="btn outline" onClick={() => handleDelete(data.id)}>Удалить</button>
                <Link to={`/geographical_object/${data.id}`}>
                    <button className="btn fill">Посмотреть</button>
                </Link>
            </div>
        </div>
    );
};

export default GeographicalObjects;
