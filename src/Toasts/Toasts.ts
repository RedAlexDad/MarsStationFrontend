import {toast} from "react-toastify";

// @ts-ignore
export const successMessage = (username) => {
	toast.success(`Добро пожаловать, ${username}!`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

export const errorMessage = () => {
	toast.error(`Неправильный логин или пароль`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

export const logOutMessage = () => {
	toast.info(`Вы вышли из аккаунта`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
}

export const groupAlreadyAddedMessage = () => {
	toast.warning(`Вы уже добавили этот географический объект в марсианской станции`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

// @ts-ignore
export const groupAddedMessage = (georaphical_object, id_mars_station) => {
	toast.success(`Географический объект: ${georaphical_object} успешно добавлена в марсианской станции №${id_mars_station}`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

// @ts-ignore
export const groupRemoveMessage = (georaphical_object, id_mars_station) => {
	toast.info(`Группа ${georaphical_object} успешно удалена из занятия №${id_mars_station}`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

// @ts-ignore
export const lessonDeleteMessage = (id) => {
	toast.info(`Географический объект №${id} успешно удалено`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

// @ts-ignore
export const lessonSendMessage = (id) => {
	toast.success(`Географический объект №${id} успешно отправлено`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

// @ts-ignore
export const lessonSaveMessage = (id) => {
	toast.success(`Географический объект №${id} успешно сохранено`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

export const requestErrorMessage = () => {
	toast.error(`Что-то пошло не так`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};

export const emptyGroupsMessage = () => {
	toast.warning(`Добавьте Географический объект в марсианскую станцию`, {
		position: toast.POSITION.BOTTOM_RIGHT
	});
};