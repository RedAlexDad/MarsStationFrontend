// Мы определяем интерфейс GeographicalObject, который описывает структуру данных географического объекта
import {getMockGeographicalObjects} from "../assets/MockGeographicalObjects.ts";
// Получаем изображение для MOCK-объекта
import defaultImage from '../assets/Default.png';

export interface GeographicalObject {
    id: number; // Идентификатор объекта
    feature: string; // Название объекта
    type: string; // Тип объекта
    size: number | string;  // Площадь объекта
    status: boolean; // Статус объекта
    describe: string; // Описание объекта
    photo: string | null; // URL фотографии объекта или null, если фотографии нет
}

// Мы также создаём интерфейс GeographicalObjectResult для описания структуры результата запроса
export interface GeographicalObjectResult {
    count: number; // Количество объектов в результате
    data: GeographicalObject[]; // Массив объектов
    next_url: string; // Ссылка на след. страницы
    previous_url: string; // Ссылка на пред. страницы
}

export const GET_FILTRATION_GeographicalObjectsPaginations = async (filterKeyword: string, page: number): Promise<GeographicalObjectResult> => {
    // Если запрос не удался, используем мок-данные
    const mockGeographicalObjects = getMockGeographicalObjects();

    try {
        // Определяем параметры запроса, включая номер страницы и количество объектов на странице
        const params = new URLSearchParams({
            page: page.toString(),
            status: 'True', // или любой другой необходимый параметр
        });

        // Формируем URL запроса с параметрами
        let url = '';

        if (!filterKeyword) {
            url = `http://127.0.0.1:8000/api/geographical_object/?${params}`;
        } else {
            url = `http://127.0.0.1:8000/api/geographical_object/?${params}&feature=${filterKeyword}`;
        }

        // Отправляем GET-запрос на сервер
        const response = await fetch(url);

        if (!response.ok) {
            return {
                // @ts-ignore
                count: mockGeographicalObjects.count,
                next_url: '',
                previous_url: '',
                // @ts-ignore
                data: mockGeographicalObjects.data
            }
        }

        // Парсим ответ в формат JSON и сохраняем в переменной 'data'
        const data: GeographicalObjectResult = await response.json();
        // console.log('info:', data)

        // Если photo пустой, и заменить его на изображение по умолчанию
        // @ts-ignore
        if (Array.isArray(data.results)) {
            // @ts-ignore
            data.results.forEach(item => {
                if (!item.photo) {
                    item.photo = defaultImage;
                }
            });
        }

        // const count = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        return {
            // @ts-ignore
            count: data.count,
            // @ts-ignore
            data: data.results,
            // @ts-ignore
            next_url: data.next,
            // @ts-ignore
            previous_url: data.previous,
        };
    } catch (error) {
        // console.error('Error fetching geographical objects:', error);
        return {
            // @ts-ignore
            count: mockGeographicalObjects.count,
            next_url: '',
            previous_url: '',
            // @ts-ignore
            data: mockGeographicalObjects.data
        }
    }
};