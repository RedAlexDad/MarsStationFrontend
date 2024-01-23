import "./Breadcrumbs.sass"
import {Link, useLocation} from "react-router-dom";
import {FaChevronRight} from "react-icons/fa6";
import {FaHome} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import {updateGeographicalObjectInfo} from "../../store/GeographicalObject.ts";

const Breadcrumbs = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const MarsStation = useSelector((state: RootState) => state.mars_station.info);
  const GegographicalObject = useSelector((state: RootState) => state.geographical_object.info);
  const setGegographicalObject = (value: any) => {
    dispatch(updateGeographicalObjectInfo(value))
  }

  let currentLink = ''

  const resetSelectedGeographicalObject = () => setGegographicalObject(undefined)

  const topics = {
    "geographical_object": "Географические объекты",
    "mars_station": "Марсианские станции",
    "home": "Главная",
    "login": "Вход",
    "register": "Регистрация",
  }

  const exclude_topics = ["edit"]

  const crumbs = location.pathname.split('/').filter(crumb => crumb !== '').map(crumb => {

    currentLink += `/${crumb}`
    if (exclude_topics.find(x => x == crumb)) {
      return
    }

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

    if (currentLink.match(new RegExp('mars_station/(\d*)'))) {
      return (
          <div className={"crumb"} key={crumb}>
            <Link to={currentLink}>
              {<p>Марсианская станция №{MarsStation?.id}</p> || "Создание марсианской станции"}
            </Link>
            <FaChevronRight className={"chevron-icon"}/>
          </div>
      )
    }

    if (currentLink.match(new RegExp('geographical_object/(\d*)'))) {
      return (
          <div className={"crumb"} key={crumb}>
            <Link to={currentLink}>
              {GegographicalObject?.feature}
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
            <Link to={"/geographical_object/"}>
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