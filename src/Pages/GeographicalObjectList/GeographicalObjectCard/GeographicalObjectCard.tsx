import "./GeographicalObjectCard.sass";
import axios from "axios";
import {GeographicalObject} from "../../../Types";
import {Link} from "react-router-dom";
import mockImage from "../../../assets/mock.png";
import {DOMEN, requestTime} from "../../../Consts.ts";
import {useEffect, useState} from "react";

export default function GeographicalObjectCard ({geographical_object}: {
    geographical_object: GeographicalObject;
}) {
    const [photoUrl, setPhotoUrl] = useState('');

    const get_photo = async () => {
        const url: string = `${DOMEN}api/geographical_object/${geographical_object.id}/image/`
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            signal: new AbortController().signal,
            timeout: requestTime,
        })
            .then(() => {
                setPhotoUrl(url)
            })
            .catch(() => {
                setPhotoUrl(mockImage)
            })
    };

    useEffect(() => {
        if (geographical_object.id !== -1 || geographical_object.id !== undefined) {
            get_photo();
        }
    }, [geographical_object.id]);

    return (
        <div className="card-wrapper">
            <Link to={`/geographical_object/${geographical_object.id}/`}
                  style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="preview">
                    <img
                        src={photoUrl}
                        alt=""
                    />
                </div>
                <div className="card-content">
                    <div className="content-top">
                        <h3 className="title">{geographical_object.feature}</h3>
                    </div>
                </div>
            </Link>
        </div>
    )
        ;
};
