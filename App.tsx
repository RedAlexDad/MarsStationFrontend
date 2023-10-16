import Base from "./components/Base.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GeographicalObjectService from "./components/Main.tsx";
import ReactDOM from "react-dom/client";
import GeographicalObject from "./components/GeographicalObject.tsx";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        {/*<div className="App">*/}
            <Routes>
                {/*Начальное меню*/}
                <Route path="/" element={<Base/>}/>
                {/*Список географических объектов*/}
                <Route path="/geographical_object/" element={<GeographicalObjectService/>}/>
                {/*Информация о географическом объекте*/}
                <Route path="/geographical_object/:id" element={<GeographicalObject/>} />
            </Routes>
        {/*</div>*/}
    </BrowserRouter>
);