import {useState, useEffect} from 'react'
import {GET_GeographicalObjects, GeographicalObjectResult} from '../modules/GET_GeographicalObjects.ts'
import GeographicalObjects from './GeographicalObjects.tsx';
import "../styles/main_menu.css"
import "../styles/search_button.css"
import {PUT_GeographicalObject} from "../modules/PUT_GeographicalObject.ts";
import FiltrationGeographicalObject from "./Filtration.tsx";

function GeographicalObjectService() {
    // Мы создаём состояние geographical_object и функцию для его обновления с начальным значением
    // {count: 0, data: []}, представляющим пустой список географических объектов.
    const [geographical_object, setGeographicalObject] = useState<GeographicalObjectResult>({count: 0, data: []});

    // Мы определяем функцию fetchData, которая асинхронно загружает данные географических объектов
    // с использованием GET_GeographicalObjects и обновляет состояние geographical_object.
    const fetchData = async () => {
        const data = await GET_GeographicalObjects();
        // Вызываем функцию получения данных при загрузке
        setGeographicalObject(data);
    };

    // Мы используем (ХУКИ) useEffect, чтобы выполнить загрузку данных при монтировании компонента.
    useEffect(() => {
        // Выполним загрузку данных при монтировании компонента
        fetchData();
    }, []);

    // Мы определяем функцию handleDelete, которая будет вызываться при удалении географического объекта.
    function handleDelete(id: number) {
        // console.log('Попытка удаления географического объекта с ID:', id)
        // Находим географический объект с соответствующим ID
        const objectToDelete = geographical_object.data.find(object => object.id === id);
        console.log('geographical_object geographical_object.data[id]:', objectToDelete)
        // Мы вызываем PUT_GeographicalObject, чтобы удалить объект с указанным id.
        PUT_GeographicalObject(id, objectToDelete)
            .then((success) => {
                if (success) {
                    // Если удаление успешно, мы можем обновить данные, чтобы отразить изменения.
                    fetchData(); // Добавьте эту строку для обновления данных
                } else {
                    // Если удаление не удалось, мы выводим сообщение об ошибке в консоль
                    console.error('Failed to delete geographical object');
                }
            });
    }

    const setGeographicalObjectData = (data: any) => {
        console.log('After filtration: ', data)
        setGeographicalObject(data);
    }

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
                    <GeographicalObjects key={object.id} data={object} handleDelete={handleDelete}/>
                ))}
            </div>
            <FiltrationGeographicalObject setGeographicalObjectData={setGeographicalObjectData}/>
        </>
    );
};

export default GeographicalObjectService;