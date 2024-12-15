import express from "express";
import validateRequest from "../middleware/validateRequest";
import auth from "../middleware/auth";
import { USER_ROLE } from "../User/user.constant";
import { SurveyCompletedControllers } from "./surveyCompleted.controller";

const router = express.Router();

router.post(
    "/create-survey",
    auth(USER_ROLE.superAdmin, USER_ROLE.user),
    SurveyCompletedControllers.createSurveyCompleted
);

router.get(
    "/all-surveys",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user,),
    SurveyCompletedControllers.getAllSurveyCompleted
);

export const SurveyCompletedRoutes = router;
