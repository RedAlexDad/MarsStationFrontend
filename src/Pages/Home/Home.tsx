import "./Home.sass"
import {Link} from "react-router-dom";

export default function HomePage() {
	return (
		<div className="home-page-wrapper">
			<div className="planet">
                <Link className="orbit" to="/geographical_object/">
                    <div className="moon"></div>
                </Link>
            </div>
		</div>
	)
}