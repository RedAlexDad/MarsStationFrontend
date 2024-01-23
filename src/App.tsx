import "./Styles/Main.sass"
import "./Styles/Reset.sass"
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import GeographicalObjectPage from "./Pages/GeographicalObject/GeographicalObject";
import GeographicalObjectListPage from "./Pages/GeographicalObjectList/GeographicalObjectList";
import HomePage from "./Pages/Home/Home.tsx";
import {useState} from "react";
import {GeographicalObject} from "./Types.ts";
import Breadcrumbs from "./Components/Breadcrumbs/Breadcrumbs.tsx";

function App() {
    const [selectedGeographicalObject, setSelectedGeographicalObject] = useState<GeographicalObject | undefined>(undefined)

    return (
        <BrowserRouter basename="/MarsStationFrontend">
            <div className="App">
                <div className="wrapper">
                    {/*<Header/>*/}
                    <div className={"content-wrapper"}>
                        <Breadcrumbs selectedGeographicalObject={selectedGeographicalObject}
                                     setSelectedGeographicalObject={setSelectedGeographicalObject}/>
                        <Routes>
                            <Route path="/" element={<Navigate to="/home/" replace/>}/>
                            {/*Начальное меню*/}
                            <Route path="/home/" element={<HomePage/>}/>

                            {/* Список географических объектов */}
                            <Route path="/geographical_object/" element={<GeographicalObjectListPage/>}/>

                            {/*Информация о географическом объекте*/}
                            <Route path="/geographical_object/:id_geographical_object/"
                                // element={<GeographicalObjectPage/>}/>
                                   element={<GeographicalObjectPage
                                       selectedGeographicalObject={selectedGeographicalObject}
                                       setSelectedGeographicalObject={setSelectedGeographicalObject}
                                   />}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App