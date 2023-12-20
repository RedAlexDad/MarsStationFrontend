import "./GeographicalObjectCard.sass";
import {Link} from "react-router-dom";
import Add from "../../../assets/Add.png";

export default function GeographicalObjectCardAdd() {
    return (
        <div className="card-wrapper" style={{height: '100%'}}>
            <Link to={`/geographical_object/add/`}
                  style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="preview">
                    <img
                        src={Add}
                        alt=""
                    />
                </div>
            </Link>
        </div>
    )
};
