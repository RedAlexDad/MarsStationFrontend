import {Link} from "react-router-dom";
import "../styles/main_space.css";

function Base() {
    return (
        <>
            <div className="container">
                <div className="planet"></div>
                <Link className="orbit" to="/geographical_object">
                    <div className="moon"></div>
                </Link>
            </div>
        </>
    );
}

export default Base;
