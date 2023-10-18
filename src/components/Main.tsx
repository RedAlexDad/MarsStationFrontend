import {useState, useEffect} from 'react'
import {
    GeographicalObjectResult,
    GET_FILTRATION_GeographicalObjectsPaginations
} from '../modules/GET_GeographicalObjects.ts'
import GeographicalObjects from './GeographicalObjects.tsx';
import "../styles/main_menu.css"
import "../styles/search_button.css"
import FiltrationGeographicalObject from "./Filtration.tsx";

function GeographicalObjectService() {
    // Мы создаём состояние geographical_object и функцию для его обновления с начальным значением
    // {count: 0, data: []}, представляющим пустой список географических объектов.
    const [geographical_object, setGeographicalObject] = useState<GeographicalObjectResult>({count: 0, next_url: '', previous_url: '', data: []});

    // Для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Мы определяем функцию fetchData, которая асинхронно загружает данные географических объектов
    // с использованием GET_GeographicalObjectsPaginations и обновляет состояние geographical_object.
    const fetchData = async (filterKeyword: any, page: number) => {
        const data = await GET_FILTRATION_GeographicalObjectsPaginations(filterKeyword, page);
        setGeographicalObject(data);
    };

    // Обработчик для кнопки "Next" - увеличивает текущую страницу на 1
    const handleNextPage = () => {
        if (currentPage * itemsPerPage < geographical_object.count) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Обработчик для кнопки "Previous" - уменьшает текущую страницу на 1
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Мы используем useEffect, чтобы выполнить загрузку данных при монтировании компонента
    // и при изменении текущей страницы.
    useEffect(() => {
        fetchData(filterKeyword, currentPage);
    }, [currentPage]);


    const setGeographicalObjectData = (data: any) => {
        console.log('After filtration: ', data)
        setGeographicalObject(data);
    }

    const [filterKeyword, setFilterData] = useState('');

    return (
        <>
            <div className="div-full">
                <div className="background_mars">
                    <div className="planet"></div>
                    <a className="orbit">
                        <div className="moon"></div>
                    </a>
                </div>
            </div>
            <div className="grid-container">
                {geographical_object.data.map((object) => (
                    // @ts-ignore
                    <GeographicalObjects key={object.id} data={object}/>
                ))}
            </div>
            <FiltrationGeographicalObject
                setGeographicalObjectData={setGeographicalObjectData}
                setFilterData={setFilterData}
                currentPage={currentPage}
            />
            <div className="pagination" style={{zIndex: '10'}}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= geographical_object.count}>
                    Next
                </button>
            </div>
        </>
    );
};

export default GeographicalObjectService;