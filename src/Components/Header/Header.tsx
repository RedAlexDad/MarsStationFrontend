import "./Header.sass"
// import NavMenu from "./NavMenu/NavMenu.tsx";
import ProfileMenu from "./ProfileMenu/ProfileMenu";

const Header = () => {
    return (
        <div className={"header-wrapper"}>
            <div className="right-container">
                <ProfileMenu/>
            </div>
        </div>
    )
}

export default Header;