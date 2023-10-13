// Мы создаём интерфейс GeographicalObject, который описывает структуру данных географического объекта
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

// Функция GET_GeographicalObject получает данные о географическом объекте по его id
export const GET_GeographicalObject = async (id: number): Promise<GeographicalObjectResult> => {
    try {
        // Мы отправляем GET-запрос на сервер, указывая id объекта в URL
        const response = await fetch(`http://127.0.0.1:8000/api/geographical_object/${id}`);
        // Если сервер возвращает успешный ответ (status 200), то мы разбираем JSON-данные и возвращаем результат
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: GeographicalObject = await response.json();
        // Мы возвращаем объект GeographicalObjectResult, указывая, что в результате только один объект
        return {
            count: 1, // Только один объект, если запрос успешен
            data: [data],
        };
    } catch (error) {
        // Мы ловим ошибку, если запрос завершился неудачей, и выводим её в консоль
        console.error('Error fetching geographical object:', error);
        // В случае ошибки возвращаем пустой результат с count = 0
        return {
            count: 0,
            data: [],
        };
    }
};
