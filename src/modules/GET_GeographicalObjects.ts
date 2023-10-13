// Мы определяем интерфейс GeographicalObject, который описывает структуру данных географического объекта
export interface GeographicalObject {
    id: number; // Идентификатор объекта
    feature: string; // Название объекта
    type: string; // Тип объекта
    size: number | string; // Площадь объекта
    status: boolean; // Статус объекта
    describe: string; // Описание объекта
    url_photo: string | null; // URL фотографии объекта или null, если фотографии нет
}

// Мы также создаём интерфейс GeographicalObjectResult для описания структуры результата запроса
export interface GeographicalObjectResult {
    count: number; // Количество объектов в результате
    data: GeographicalObject[]; // Массив объектов
}

// Функция GET_GeographicalObjects получает список географических объектов
export const GET_GeographicalObjects = async (): Promise<GeographicalObjectResult> => {
    try {
        // Мы отправляем GET-запрос на сервер, запрашивая список объектов
        const response = await fetch('http://127.0.0.1:8000/api/geographical_object/?status=True');
        // Если сервер возвращает успешный ответ (status 200), то мы разбираем JSON-данные и возвращаем результат
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: GeographicalObject[] = await response.json();
        // Мы возвращаем объект GeographicalObjectResult, указывая количество объектов и массив объектов
        return {
            count: data.length, // Фактический счётчик объектов
            data: data,
        };
    } catch (error) {
        // Поймаем ошибку, если запрос завершился неудачей, и выводим её в консоль.
        console.error('Error fetching geographical objects:', error);
        // В случае ошибки возвращаем пустой результат с count = 0.
        return {
            count: 0,
            data: [],
        };
    }
};

// Асихронная функция для фильтрации услуг
export const GET_FILTRATION_GeographicalObjects = async (filterField: string, filterKeyword: string): Promise<GeographicalObjectResult> => {
    try {
        // Попытка выполнить асинхронный запрос
        const response = await fetch(
            `http://127.0.0.1:8000/api/geographical_object/?${filterField}=${filterKeyword}`
        );
        // Ожидание ответа от сервера
        if (!response.ok) {
            // Если ответ от сервера не успешен (код ответа не в диапазоне 200-299)
            throw new Error('Network response was not ok');
            // Генерируем ошибку
        }
        const data: GeographicalObject[] = await response.json();
        // Парсим ответ в формат JSON и сохраняем в переменной 'data'
        console.log(data);
        // Выводим данные в консоль для отладки
        return {
            count: data.length,
            data: data,
        };
        // Возвращаем объект с количеством элементов и данными
    } catch (error) {
        console.error('Error fetching geographical objects:', error);
        // В случае ошибки, выводим сообщение об ошибке в консоль
        return {
            count: 0,
            data: [],
        };
        // Возвращаем объект с нулевым количеством элементов и пустыми данными
    }
};