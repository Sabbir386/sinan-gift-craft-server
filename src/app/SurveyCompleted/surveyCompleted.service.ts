import { ISurveyCompleted } from "./surveyCompleted.interface";
import { SurveyCompleted } from "./surveyCompleted.model";


const createSurveyCompleted = async (data: ISurveyCompleted) => {
    return await SurveyCompleted.create(data);
};

const getAllSurveyCompletedByUserId = async (userId: string) => {
    return await SurveyCompleted.find({ userId });
};

export const SurveyCompletedServices = {
    createSurveyCompleted,
    getAllSurveyCompletedByUserId,
};
