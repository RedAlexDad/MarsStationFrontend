import "./GeographicalObjectList.sass"
import SearchBar from "./SearchBar/SearchBar";
import {useEffect, useState} from "react";
import GeographicalObjectCard from "./GeographicalObjectCard/GeographicalObjectCard";
import {GeographicalObjectsMock, requestTime, DOMEN} from "../../Consts";
import axios from "axios";
import Pagination from "../../Components/Pagination/Pagination.tsx";
import LoadingAnimation from "../../Components/Loading.tsx";

export default function GeographicalObjectListPage() {
    // Данные
    const [GeographicalObject, setGeographicalObjects] = useState(GeographicalObjectsMock);
    // Для поиска
    const [feature, setFeature] = useState<string>('');
    // Для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [count, setCount] = useState(0);

    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);
    // Cостояние для обновления в основном компоненте (при нажатии)
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);
    // Функция для передачи в дочерний компонент
    const handleUpdateTrigger = () => {
        setParentUpdateTrigger(true);
    };

    const searchGeographicalObject = async (currentPage: number) => {
        setLoading(true);
        // Определяем параметры запроса, включая номер страницы и количество объектов на странице
        const params = new URLSearchParams({
            page: currentPage.toString(),
            status: 'True',
            feature: feature,
        });
        const url = `${DOMEN}api/geographical_object/?${params}`
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            signal: new AbortController().signal,
            timeout: requestTime,
        })
            .then(response => {
                // console.log("Успешно!", response.data);
                setGeographicalObjects([...response.data.results]);
                // Обновление данных пагинации
                setCount(response.data.count);
                setTotalPages(Math.ceil(response.data.count / 5));
                setCurrentPage(currentPage)
                setLoading(true);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
                if (feature !== '') {
                    filterFeature(GeographicalObject);
                } else {
                    setGeographicalObjects(GeographicalObjectsMock);
                }
                setLoading(true);
                return;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Функция для фильтрации mock-объекта
    const filterFeature = (GeographicalObject: any[]) => {
        if (Array.isArray(GeographicalObject)) {
            const filteredData = GeographicalObject.filter(item => {
                console.log(feature)
                return feature
                    ? item.feature.toLowerCase().includes(feature.toLowerCase())
                    : true
            });
            setGeographicalObjects(filteredData);
        }
    };

    const handlePageChange = (newPage: any) => {
        searchGeographicalObject(newPage);
    };

    useEffect(() => {
        searchGeographicalObject(currentPage);
        if (parentUpdateTrigger) {
            setParentUpdateTrigger(false);
        }
    }, [feature, currentPage, parentUpdateTrigger]);

    useEffect(() => {
        if (loading) {
            // Если уже идет загрузка, не допускаем дополнительных запросов
            return;
        }
        // Устанавливаем состояние загрузки в true перед запросом
        setLoading(false);
    }, [currentPage, totalPages, count, loading]);

    useEffect(() => {
    }, [loading]);

    const cards = GeographicalObject.map(geographical_object => (
        <GeographicalObjectCard
            geographical_object={geographical_object}
            key={geographical_object.id}
        />
    ))

    return (
        <div className="cards-list-wrapper">
            {loading && <LoadingAnimation isLoading={loading}/>}
            <div className="top">
                <SearchBar
                    feature={feature}
                    setFeature={setFeature}
                    setParentUpdateTrigger={handleUpdateTrigger}
                />
            </div>
            <div className="bottom">
                {cards}
            </div>
            {count > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}
