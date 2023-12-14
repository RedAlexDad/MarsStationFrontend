import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User.ts";
import employeeReducer from "./Employee.ts";
import geographical_objectReducer from "./GeographicalObject.ts";
import search_feature from "./Search.ts";
import mars_station from "./MarsStation.ts";

export default configureStore({
	reducer: {
		user: userReducer,
		employee: employeeReducer,
		geographical_object: geographical_objectReducer,
		search: search_feature,
		mars_station: mars_station,
	},
});