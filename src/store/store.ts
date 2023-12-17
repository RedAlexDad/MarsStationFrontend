import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User.ts";
import employeeReducer from "./Employee.ts";
import geographical_objectReducer from "./GeographicalObject.ts";
import search_feature from "./Search.ts";
import mars_station from "./MarsStation.ts";
import mars_station_draft from "./MarsStationDraft.ts";

export const store = configureStore({
	reducer: {
		user: userReducer,
		employee: employeeReducer,
		geographical_object: geographical_objectReducer,
		search: search_feature,
		mars_station: mars_station,
		mars_station_draft: mars_station_draft,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;