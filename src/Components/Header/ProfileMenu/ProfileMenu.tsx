import "./ProfileMenu.sass"
import {useCallback, useEffect, useState} from "react";
import Hamburger from "../Hamburger/Hamburger";
import {Link} from "react-router-dom";
import axios from "axios";
import UserInfo from "./UserInfo/UserInfo";
import {useAuth} from "../../../hooks/useAuth";
import {useToken} from "../../../hooks/useToken";
import {useDesktop} from "../../../hooks/useDesktop";
import {DOMEN} from "../../../Consts.ts";
import {useDispatch, useSelector} from "react-redux";
import {updateID_draft} from "../../../store/GeographicalObject.ts";
import CustomizedBadges from "../Customization/Customization.tsx";
import GeographicalObjectModal from "../Customization/Modal/Modal.tsx";
import {RootState} from "../../../store/store.ts";
import {updateMarsStationDraft} from "../../../store/MarsStationDraft.ts";
// import { updateMarsStationDraft } from "../../../store/MarsStationDraft.ts";

const ProfileMenu = () => {
    const dispatch = useDispatch();
    const id_draft = useSelector((state: RootState) => state.geographical_object.id_draft);

    const {access_token} = useToken()
    const {is_authenticated, username, setUser, setEmployee} = useAuth()
    const {isDesktopMedium} = useDesktop();

    const marsStationDraft = async () => {
        if (id_draft !== -1) {
            try {
                const url = `${DOMEN}api/mars_station/${id_draft}/`;
                const response = await axios.get(url, {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        authorization: access_token,
                    },
                });
                dispatch(updateMarsStationDraft(response.data));
            } catch (error) {
                console.error("Ошибка!\n", error);
            }
        }
    };

    const GetIDDraftMarsStation = async () => {
        const url = `${DOMEN}api/geographical_object/`;
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
        })
            .then(response => {
                // console.log("Успешно!", response.data);
                // console.log("ID черновика: ", response.data.id_draft_service);
                dispatch(updateID_draft(response.data.id_draft_service));
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };
    const auth = async () => {
        const url = `${DOMEN}api/get_token/`;
        await axios.post(url, {}, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
        })
            .then(response => {
                const user = {
                    id_user: response.data.user_data["id"],
                    is_authenticated: true,
                    username: response.data.user_data["username"],
                    is_moderator: response.data.user_data["is_moderator"],
                };
                const employee = {
                    id_employee: response.data.employee["id"],
                    full_name: response.data.employee["name"],
                    post: response.data.employee["post"],
                    name_organization: response.data.employee["name_organization"],
                    address: response.data.employee["address"],
                }
                setUser(user);
                setEmployee(employee);
                GetIDDraftMarsStation();
                marsStationDraft();
            })
            .catch(error => {
                if (error.response.status == 401) {
                    console.error("Не авторизирован");
                } else {
                    console.error("Ошибка!\n", error);
                }
            });
    };

    useEffect(() => {
        if (!is_authenticated) {
            auth();
        }
    }, [is_authenticated]);

    useEffect(() => {
        marsStationDraft();
    }, [id_draft]);

    const [isOpen, setIsOpen] = useState<boolean>(false)

    if (is_authenticated) {
        return (
            <div className={"profile-menu-wrapper"}>
                <div className={"menu-wrapper " + (isOpen ? "open" : "")}>
                    <Link to="/home" className="menu-item" style={{textDecoration: 'none'}}
                          onClick={() => setIsOpen(false)}>
                        <span className="item">Главная</span>
                    </Link>
                    <Link to="/geographical_object" className="menu-item" style={{textDecoration: 'none'}}
                          onClick={() => setIsOpen(false)}>
                        <span className="item">Географические объекты</span>
                    </Link>
                    <Link to="/mars_station" className="menu-item" style={{textDecoration: 'none'}}
                          onClick={() => setIsOpen(false)}>
                        <span className="item">Марсианские станции</span>
                    </Link>
                    <CustomizedBadges/>
                    {/*<GeographicalObjectModal/>*/}
                    {!isDesktopMedium &&
                        <Link to="/profile" className="menu-item" style={{textDecoration: 'none'}}
                              onClick={() => setIsOpen(false)}>
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
                      onClick={() => setIsOpen(false)}>
                    <span className="item">Главная</span>
                </Link>
                <Link to="/geographical_object" className="menu-item" style={{textDecoration: 'none'}}
                      onClick={() => setIsOpen(false)}>
                    <span className="item">Географические объекты</span>
                </Link>
                <Link to="/auth" className="menu-item" style={{textDecoration: 'none'}}
                      onClick={() => setIsOpen(false)}>
                    <span className="item">Вход</span>
                </Link>
            </div>
            <Hamburger isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>

    )
}

export default ProfileMenu;