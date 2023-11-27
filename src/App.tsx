import "./Styles/Main.sass"
import "./Styles/Reset.sass"
import Header from "./Components/Header/Header";
import {useState} from 'react'
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {GeographicalObject} from "./Types";
import GeographicalObjectPage from "./Pages/GeographicalObject/GeographicalObject";
import GeographicalObjectListPage from "./Pages/GeographicalObjectList/GeographicalObjectList";
import ProfilePage from "./Pages/Profile/ProfilePage";
import HomePage from "./Pages/Home/Home";

function App() {
    const [selectedGeographicalObject, setSelectedGeographicalObject] = useState<GeographicalObject | undefined>(undefined)

    return (
        <BrowserRouter basename="/mars">
            <div className="App">
                <div className="wrapper">
                    <Header/>
                    <div className={"content-wrapper"}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            {/*Начальное меню*/}
                            <Route path="/home" element={<HomePage />} />
                            {/*Личный кабинет*/}
                            <Route path="/profile" element={<ProfilePage />} />
                            {/*Список географических объектов*/}
                            <Route path="/geographical_object/" element={<GeographicalObjectListPage/>}/>
                            {/*Информация о географическом объекте*/}
                            <Route path="/geographical_object/:id"
                                   element={<GeographicalObjectPage
                                       selectedGeographicalObject={selectedGeographicalObject}
                                       setSelectedGeographicalObject={setSelectedGeographicalObject}/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
