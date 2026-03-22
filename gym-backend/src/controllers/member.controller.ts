import { Request, Response } from "express";
import * as memberService from "../services/member.service";
import { getEligibleMembersService } from "../services/member.service";

export const createMember = async (req: Request, res: Response) => {
    try{
        const member = await memberService.createMemberService(req.body);

        res.status(201).json({
            success: true,
            data: member,
        });
    } catch (error: any){
        res.status(400).json({success: false, message: error.message});
    }
};

export const getMembers = async (_req: Request, res: Response) => {
    try{
        const members = await memberService.getAllMembersService();

        res.status(200).json({
            success: true,
            data: members,
        });
    } catch(error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMemberById = async (req: Request, res: Response) => {
    try{
        const member = await memberService.getMemberByIdService( Number(req.params.id));

        res.status(200).json({
            success: true,
            data: member,
        })
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateMembers = async (req: Request, res: Response) => {
    try{
        const member = await memberService.updateMemberService(Number(req.params.id), req.body);
        res.status(200).json({
            success: true,
            data: member,
        });
    } catch(error: any){
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteMember = async (req: Request, res: Response) => {
    try{
        await memberService.deleteMemberService(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: "Member deleted successfully",
        });
    } catch (error: any){
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const getEligibleMembers = async (req: Request, res: Response) => {
    try {
        const members = await getEligibleMembersService();
        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};