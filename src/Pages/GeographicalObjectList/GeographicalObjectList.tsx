import "./GeographicalObjectList.sass"
import SearchBar from "./SearchBar/SearchBar";
import {useEffect, useState} from "react";
import GeographicalObjectCard from "./GeographicalObjectCard/GeographicalObjectCard";
import {GeographicalObjectsMock, requestTime, DOMEN} from "../../Consts";
import {GeographicalObject} from "../../Types";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {updateGeographicalObject} from "../../store/GeographicalObject.ts";
import {useToken} from "../../hooks/useToken.ts";
import {updateID_draft} from "../../store/IdDraftMarsMtation.ts";

const GeographicalObjectListPage = () => {
    const {access_token} = useToken()
    const [GeographicalObject, setGeographicalObject] = useState<GeographicalObject[]>([]);
    const [isMock, setIsMock] = useState<boolean>(false);

    const dispatch = useDispatch()
    // @ts-ignore
    const feature = useSelector((state: string) => state.search_feature.feature);

    const searchGeographicalObject = async () => {
        // Определяем параметры запроса, включая номер страницы и количество объектов на странице
        const params = new URLSearchParams({
            page: '1',
            status: 'True',
            feature: feature,
        });
        const url = `${DOMEN}api/geographical_object/?${params}`
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
            signal: new AbortController().signal,
            timeout: requestTime,
        })
            .then(response => {
                setGeographicalObject(response.data.results);
                setIsMock(false);
                // console.log("Успешно!", response.data);
                dispatch(updateGeographicalObject([...response.data.results]));
                dispatch(updateID_draft(response.data.id_draft_service));
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
                createMock();
                return;
            });
    };

    const createMock = () => {
        setIsMock(true);
        setGeographicalObject(GeographicalObjectsMock)
    }

    useEffect(() => {
        searchGeographicalObject()
    }, [feature])

    const cards = GeographicalObject.map(geographical_object => (
        <GeographicalObjectCard
            geographical_object={geographical_object}
            key={geographical_object.id}
            isMock={isMock}
        />
    ))

    return (
        <div className="cards-list-wrapper">
            <div className="top">
                <SearchBar feature={feature}/>
            </div>
            <div className="bottom">
                {cards}
            </div>
        </div>
    )
}

export default GeographicalObjectListPage;