import "./Breadcrumbs.sass"
import {Link, useLocation} from "react-router-dom";
import {FaChevronRight} from "react-icons/fa6";
import {FaHome} from "react-icons/fa";
import {GeographicalObject} from "../../Types.ts";
import {Dispatch} from "react";

const Breadcrumbs = ({ selectedGeographicalObject, setSelectedGeographicalObject }: { selectedGeographicalObject: GeographicalObject | undefined, setSelectedGeographicalObject: Dispatch<GeographicalObject | undefined> }) => {
    const location = useLocation()

    let currentLink = ''
    console.log(selectedGeographicalObject)

    const resetSelectedGeographicalObject = () => setSelectedGeographicalObject(undefined)

    const topics = {
        "geographical_object": "Географические объекты",
        "home": "Главная",
    }

    const crumbs = location.pathname.split('/').filter(crumb => crumb !== '').map(crumb => {

        currentLink += `/${crumb}`

        if (Object.keys(topics).find(x => x == crumb)) {
            return (
                <div className={"crumb"} key={crumb}>
                    <Link to={currentLink} onClick={resetSelectedGeographicalObject}>
                        {topics[crumb as keyof typeof topics]}
                    </Link>
                    <FaChevronRight className={"chevron-icon"}/>
                </div>
            )
        }

        if (currentLink.match(new RegExp('geographical_object/(\d*)'))) {
            return (
                <div className={"crumb"} key={crumb}>
                    <Link to={currentLink}>
                        {selectedGeographicalObject?.feature}
                    </Link>
                    <FaChevronRight className={"chevron-icon"}/>
                </div>
            )
        }
    });

    return (
        <div className="breadcrumbs-wrapper">
            <div className="breadcrumbs">
                <div className="crumb">
                    <Link to={"/home/"}>
                        <FaHome className="home-icon"/>
                    </Link>
                    <FaChevronRight className="chevron-icon"/>
                </div>
                {crumbs}
            </div>
        </div>
    )
}

export default Breadcrumbs;