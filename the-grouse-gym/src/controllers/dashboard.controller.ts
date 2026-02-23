import { getDashboardStats } from "../services/dashboard.service"
import { Request, Response } from "express";

export const dashboard = async (req: Request, res: Response) => {
    try {
        const data = await getDashboardStats();
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Dashboard fetch failed"
        });
    }
};