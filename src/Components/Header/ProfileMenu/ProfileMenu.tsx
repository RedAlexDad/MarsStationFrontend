import "./ProfileMenu.sass"
import {useEffect, useState} from "react";
import Hamburger from "../Hamburger/Hamburger";
import {Link} from "react-router-dom";
import UserInfo from "./UserInfo/UserInfo";
import {useAuth} from "../../../hooks/useAuth";
import {useToken} from "../../../hooks/useToken";
import {useDispatch, useSelector} from "react-redux";
import {updateGeographicalObject, updateID_draft} from "../../../store/GeographicalObject.ts";
import BasketBadges from "../Basket/Basket.tsx";
import {RootState} from "../../../store/store.ts";
import {updateMarsStationDraft} from "../../../store/MarsStationDraft.ts";
import {
    AccountApi,
    ApiGeographicalObjectGetRequest,
    ApiGetTokenPostRequest,
    GeographicalObjectApi,
    GETMarsStationRequest,
    MarsStationApi,
    MarsStationSerializerDetailToJSON
} from "../../../../swagger/generated-code";

export default function ProfileMenu() {
    const dispatch = useDispatch();
    const id_draft = useSelector((state: RootState) => state.geographical_object.id_draft);

    const {access_token} = useToken()
    const {is_authenticated, is_moderator, setUser, setEmployee} = useAuth()

    const marsStationDraft = async () => {
        if (id_draft !== -1 && id_draft !== undefined) {
            const api = new MarsStationApi();
            const requestParameters: GETMarsStationRequest = {
                id: id_draft,
                authorization: access_token,
            };
            await api.gETMarsStation(requestParameters)
                .then((response) => {
                    // Преобразование данных
                    const transformedResponse = MarsStationSerializerDetailToJSON(response);
                    dispatch(updateMarsStationDraft(transformedResponse));
                })
                .catch((error) => {
                    console.error("Ошибка!\n", error);
                })
        }
    };

    const GetIDDraftMarsStation = async () => {
        const api = new GeographicalObjectApi();
        const requestParameters: ApiGeographicalObjectGetRequest = {
            authorization: access_token,
        };
        api.apiGeographicalObjectGet(requestParameters)
            .then(response => {
                // console.log("Успешно!", response);
                dispatch(updateGeographicalObject([...response.results]));
                dispatch(updateID_draft(response.idDraftService));
                // console.log("ID черновика: ", response.idDraftService);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    const auth = () => {
        const api = new AccountApi();
        const requestParameters: ApiGetTokenPostRequest = {
            authorization: access_token,
        };
        api.apiGetTokenPost(requestParameters)
            .then((response) => {
                const user = {
                    id_user: response.user.id,
                    is_authenticated: true,
                    username: response.user.username,
                    is_moderator: response.user.isModerator,
                };
                const employee = {
                    id_employee: response.employee.id,
                    full_name: response.employee.fullName,
                    post: response.employee.post,
                    name_organization: response.employee.nameOrganization,
                    address: response.employee.address,
                };

                setUser(user);
                setEmployee(employee);
                GetIDDraftMarsStation();
                marsStationDraft();
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
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
                    <Link to="/home/" className="menu-item" style={{textDecoration: 'none'}}>
                        <span className="item">Главная</span>
                    </Link>
                    {!is_moderator &&
                        <Link to="/geographical_object/" className="menu-item" style={{textDecoration: 'none'}}>
                            <span className="item">Географические объекты</span>
                        </Link>
                    }
                    {is_moderator &&
                        <Link to="/geographical_object/moderator/" className="menu-item"
                              style={{textDecoration: 'none'}}>
                            <span className="item">Географические объекты</span>
                        </Link>
                    }
                    <Link to="/mars_station/" className="menu-item" style={{textDecoration: 'none'}}>
                        <span className="item">Марсианские станции</span>
                    </Link>
                    <BasketBadges/>
                    <UserInfo/>
                </div>
                <Hamburger isOpen={isOpen} setIsOpen={setIsOpen}/>
            </div>
        )
    }

    return (
        <div className={"profile-menu-wrapper"}>
            <div className={"menu-wrapper " + (isOpen ? "open" : "")}>
                <Link to="/home/" className="menu-item" style={{textDecoration: 'none'}}>
                    <span className="item">Главная</span>
                </Link>
                <Link to="/geographical_object/" className="menu-item" style={{textDecoration: 'none'}}>
                    <span className="item">Географические объекты</span>
                </Link>
                <Link to="/auth/" className="menu-item" style={{textDecoration: 'none'}}>
                    <span className="item">Вход</span>
                </Link>
            </div>
            <Hamburger isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
    )
}