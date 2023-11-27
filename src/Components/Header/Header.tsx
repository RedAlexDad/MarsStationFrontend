import "./Header.sass"
import NavMenu from "./NavMenu/NavMenu.tsx";

const Header = () => {
    return (
        <div className="header-wrapper">

            <div className="left-container">
                {/*<h3>Марсианские станции</h3>*/}
            </div>

            <div className="right-container">
                <NavMenu/>
            </div>

        </div>
    )
}

export default Header;