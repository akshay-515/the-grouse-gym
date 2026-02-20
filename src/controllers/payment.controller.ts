import { Request, Response } from "express";
import { createPaymentWithMemberships } from "../services/payment.service";

export const createPayment = async (req: Request, res: Response) => {
    try{
        const { member_id, amount, payment_date, payment_mode, plan_type } = req.body;

        const result = await createPaymentWithMemberships(
            member_id,
            amount,
            payment_date,
            payment_mode,
            plan_type
        );

        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Something went wrong"
        });
    }
};