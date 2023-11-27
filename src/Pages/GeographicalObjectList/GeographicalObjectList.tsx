import "./GeographicalObjectList.sass"
import SearchBar from "./SearchBar/SearchBar";
import {useEffect, useState} from "react";
import GeographicalObjectCard from "./GeographicalObjectCard/GeographicalObjectCard";
import {GeographicalObjectsMock, requestTime} from "../../Consts";
import {GeographicalObject} from "../../Types";

const GeographicalObjectListPage = () => {

    const [geographical_objects, setGeographicalObject] = useState<GeographicalObject[]>([]);

    const [feature, setFeature] = useState<string>("");

    const [isMock, setIsMock] = useState<boolean>(false);

    const searchGeographicalObject = async () => {

        try {

            // Определяем параметры запроса, включая номер страницы и количество объектов на странице
            const params = new URLSearchParams({
                page: '1',
                status: 'True',
                feature: feature
            });

            const response = await fetch(`http://127.0.0.1:8000/api/geographical_object/?${params}`, {
                method: "GET",
                signal: AbortSignal.timeout(requestTime)
            })

            if (!response.ok){
                createMock();
                return;
            }

            const geographical_objects: GeographicalObject[] = await response.json()
            // @ts-ignore
            setGeographicalObject(geographical_objects.results.service)
            setIsMock(false)

        } catch (e) {
            createMock()
        }
    }

    const createMock = () => {

        setIsMock(true);
        setGeographicalObject(GeographicalObjectsMock)

    }

    useEffect(() => {
        searchGeographicalObject()
    }, [feature])

    const cards = geographical_objects.map(geographical_object  => (
        <GeographicalObjectCard geographical_object={geographical_object} key={geographical_object.id} isMock={isMock}/>
    ))

    return (
        <div className="cards-list-wrapper">

            <div className="top">

                {/*<h2>Географические объекты</h2>*/}

                <SearchBar feature={feature} setQuery={setFeature} />

            </div>

            <div className="bottom">

                { cards }

            </div>

        </div>
    )
}

export default GeographicalObjectListPage;