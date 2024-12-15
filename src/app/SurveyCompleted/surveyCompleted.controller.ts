import { Request, Response } from "express";
import { SurveyCompletedServices } from "./surveyCompleted.service";


const createSurveyCompleted = async (req: Request, res: Response) => {
    try {
        const surveyData = req.body;
        const result = await SurveyCompletedServices.createSurveyCompleted(surveyData);
        res.status(201).json({ success: true, data: result });
    } catch (error:any) {
        res.status(500).json({ success: false, message: "Failed to create survey", error: error.message });
    }
};

const getAllSurveyCompleted = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId query parameter is required" });
        }

        const surveys = await SurveyCompletedServices.getAllSurveyCompletedByUserId(userId as string);
        res.status(200).json({ success: true, data: surveys });
    } catch (error:any) {
        res.status(500).json({ success: false, message: "Failed to fetch surveys", error: error.message });
    }
};

export const SurveyCompletedControllers = {
    createSurveyCompleted,
    getAllSurveyCompleted,
};
