import { getAllMembershipsService } from "../services/membership.service"
import { Request, Response } from "express";

export const getMemberships = async (req: Request, res: Response) => {
    try {
        const data = await getAllMembershipsService();

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};