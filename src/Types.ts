import {AxiosResponse} from "axios";

// Услуга - географический объект
export interface GeographicalObject {
    id: number;
    feature: string;
    type: string;
    size: number;
    describe: string;
    photo: string;
    status: boolean;
}

export interface Transport {
    id: number;
    name: string;
    type: string;
    describe: string;
    photo: string;
}

// Заявка - марсианская станция
export interface MarsStation {
    id: number,
    type_status: string,
    date_create: string,
    date_form: string,
    date_close: string,
    status_task: number,
    status_mission: number,
    geographical_object: GeographicalObject[],
    employee: string,
    moderator: string,
    transport: Transport[]
}

// Для статуса заявки
export interface Option {
    id: number,
    name: string
}

// Аккаунт
export interface User {
    id: number,
    username: string
}

// Сотрудник
export interface Employee {
    id: number,
    full_name: string,
    post: string
    name_organization: string
    address: string
}

export type Response = Promise<AxiosResponse> | any