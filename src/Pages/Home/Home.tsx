import "./Home.sass"
// import "./Planet.css"
import {Link} from "react-router-dom";

const HomePage = () => {
	return (
		<div className="home-page-wrapper">
			<div className="planet">
                <Link className="orbit" to="/geographical_object">
                    <div className="moon"></div>
                </Link>
            </div>
		</div>
	)
}

export default HomePage;