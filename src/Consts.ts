import {GeographicalObject, Option, Transport} from "./Types";
import defaultImage from "./assets/mock.png";

export const requestTime = 1000
export const DOMEN = "http://127.0.0.1:8000/"

export const GeographicalObjectsMock: GeographicalObject[] = [
    {
        id: 1,
        feature: "Acidalia Planitia",
        type: "Planitia, planitiae",
        size: 2300,
        describe: "обширная тёмная равнина на Марсе. Размер — около 3 тысяч км, координаты центра — 50° с. ш. 339°. Расположена между вулканическим регионом Тарсис и Землёй Аравия, к северо-востоку от долин Маринера. На севере переходит в Великую Северную равнину, на юге — в равнину Хриса; на восточном краю равнины находится регион Кидония. Диаметр около 3000 км.",
        photo: defaultImage,
        status: true
    },
    {
        id: 5,
        feature: "Arabia Terra",
        type: "Terra, terrae",
        size: 5100,
        describe: "Большая возвышенная область на севере Марса, которая лежит в основном в четырехугольнике Аравия, но небольшая часть находится в четырехугольнике Маре Ацидалиум. Она густо изрыта кратерами и сильно разрушена.",
        photo: defaultImage,
        status: true
    },
    {
        id: 2,
        feature: "Alba Patera",
        type: "Patera, paterae",
        size: 530,
        describe: "Огромный низкий вулкан, расположенный в северной части региона Фарсида на планете Марс. Это самый большой по площади вулкан на Марсе: потоки извергнутой из него породы прослеживаются на расстоянии как минимум 1350 км от его пика.",
        photo: defaultImage,
        status: true
    },
    {
        id: 4,
        feature: "Amazonis Planitia",
        type: "Planitia, planitiae",
        size: 2800,
        describe: "Слабоокрашенная равнина в северной экваториальной области Марса. Довольно молода, породы имеют возраст 10-100 млн. лет. Часть этих пород представляют собой застывшую вулканическую лаву.",
        photo: defaultImage,
        status: true
    },
    {
        id: 3,
        feature: "Albor Tholus",
        type: "Tholus, tholi",
        size: 170,
        describe: "Потухший вулкан нагорья Элизий, расположенный на Марсе. Находится к югу от соседних горы Элизий и купола Гекаты. Вулкан достигает 4,5 километров в высоту и 160 километров в диаметре основания.",
        photo: defaultImage,
        status: true
    },
]

export const TransportMock: Transport[] = [
    {
        id: 1,
        name: "Mars Pathfinder Rover (USA)",
        type: "Rover",
        describe: "",
        photo: ""
    },
    {
        id: 2,
        name: "Mars 6 Lander (USSR)",
        type: "Spacecraft",
        describe: "",
        photo: ""
    },
    {
        id: 3,
        name: "Ingenuity",
        type: "Aircraft",
        describe: "",
        photo: ""
    }
]
export const STATUS_TASKS: Option[] = [
    {
        id: 1,
        name: "Черновик"
    },
    {
        id: 2,
        name: "В работе"
    },
    {
        id: 3,
        name: "Завершена"
    },
    {
        id: 4,
        name: "Отменена"
    },
    {
        id: 5,
        name: "Удалена"
    }
]

export const STATUS_MISSIONS: Option[] = [
    {
        id: 0,
        name: "Ошибка!"
    },
    {
        id: 1,
        name: "В работе"
    },
    {
        id: 2,
        name: "Успех"
    },
    {
        id: 3,
        name: "Потеря"
    }
]