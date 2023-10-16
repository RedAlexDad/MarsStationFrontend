// Мы создаём функцию PUT_GeographicalObject, которая асинхронно отправляет запрос на обновление географического объекта с указанным id и статусом false
export const PUT_GeographicalObject = async (id: number, data: any): Promise<boolean> => {
    try {
        // Мы отправляем PUT-запрос на URL для обновления объекта, указывая его id и передавая status как false
        const response = await fetch(`http://127.0.0.1:8000/api/geographical_object/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data, status: false}),
        });

        // Если сервер возвращает успешный ответ (status 200), то возвращаем true
        if (response.ok) {
            return true; // Успешное обновление с установкой статуса в false
        } else {
            // Если сервер вернул ошибку, то выбрасываем ошибку, чтобы обработать её в коде, где вызывается PUT_GeographicalObject
            throw new Error('Failed to update geographical object');
        }
    } catch (error) {
        // Поймаем ошибку, если запрос завершился неудачей, и выводим её в консоль
        console.error('Error updating geographical object:', error);
        // Возвращаем false, чтобы указать, что обновление завершилось неудачей.
        return false;
    }
};
