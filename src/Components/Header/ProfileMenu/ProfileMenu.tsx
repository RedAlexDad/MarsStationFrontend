import "./ProfileMenu.sass"
import {useEffect, useState} from "react";
import Hamburger from "../Hamburger/Hamburger";
import {Link} from "react-router-dom";
import axios from "axios";
import UserInfo from "./UserInfo/UserInfo";
import {useAuth} from "../../../hooks/useAuth";
import {useToken} from "../../../hooks/useToken";
import {useDesktop} from "../../../hooks/useDesktop";
import {Response} from "../../../Types";
import {DOMEN} from "../../../Consts.ts";

const ProfileMenu = () => {

    const {access_token} = useToken()

    const {is_authenticated, username, setUser} = useAuth()

    const {isDesktopMedium} = useDesktop();

    const fetchLesson = async () => {
        try {
            // console.log(access_token)
            const response: Response = await axios(`${DOMEN}api/mars_station/`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'authorization': access_token
                },
            })
            console.log(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const auth = async () => {
        try {
            const response: Response = await axios(`${DOMEN}api/get_token/`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'authorization': access_token
                },
            })
            // console.log(response.data)
            if (response.status == 200) {
                const permissions = {
                    is_authenticated: true,
                    id: response.data.user_data["id"],
                    username: response.data.user_data["username"],
                    is_moderator: response.data.user_data["is_moderator"],
                }
                setUser(permissions)
                await fetchLesson()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!is_authenticated) {
            auth()
        }
    }, []);

    const [isOpen, setIsOpen] = useState<boolean>(false)

    if (is_authenticated) {
        return (
            <div className={"profile-menu-wrapper"}>
                <div className={"menu-wrapper " + (isOpen ? "open" : "")}>
                    <Link to="/home" className="menu-item" style={{textDecoration: 'none'}}
                        // @ts-ignore
                          onClick={(e) => setIsOpen(false)}>
                        <span className="item">Главная</span>
                    </Link>
                    <Link to="/geographical_object" className="menu-item" style={{textDecoration: 'none'}}
                        // @ts-ignore
                          onClick={(e) => setIsOpen(false)}>
                        <span className="item">Географические объекты</span>
                    </Link>
                    <Link to="/mars_station" className="menu-item" style={{textDecoration: 'none'}}
                        // @ts-ignore
                          onClick={(e) => setIsOpen(false)}>
                        <span className="item">Марсианские станции</span>
                    </Link>
                    {!isDesktopMedium &&
                        <Link to="/profile" className="menu-item" style={{textDecoration: 'none'}}
                            // @ts-ignore
                              onClick={(e) => setIsOpen(false)}>
                            <span className="item">{username}</span>
                        </Link>
                    }
                    {isDesktopMedium && <UserInfo/>}
                </div>
                <Hamburger isOpen={isOpen} setIsOpen={setIsOpen}/>
            </div>
        )
    }

    return (
        <div className={"profile-menu-wrapper"}>
            <div className={"menu-wrapper " + (isOpen ? "open" : "")}>
                <Link to="/home" className="menu-item" style={{textDecoration: 'none'}}
                    // @ts-ignore
                      onClick={(e) => setIsOpen(false)}>
                    <span className="item">Главная</span>
                </Link>
                <Link to="/geographical_object" className="menu-item" style={{textDecoration: 'none'}}
                    // @ts-ignore
                      onClick={(e) => setIsOpen(false)}>
                    <span className="item">Географические объекты</span>
                </Link>
                <Link to="/auth" className="menu-item" style={{textDecoration: 'none'}}
                    // @ts-ignore
                      onClick={(e) => setIsOpen(false)}>
                    <span className="item">Вход</span>
                </Link>
            </div>
            <Hamburger isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>

    )
}

export default ProfileMenu;