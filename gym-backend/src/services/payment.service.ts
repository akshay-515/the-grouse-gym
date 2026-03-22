    import { db } from "../db";

    const PLAN_DURATION: Record<string, number> = {
        MONTHLY: 1,
        QUARTERLY: 3,
        HALF_YEARLY: 6,
        YEARLY:12
    };

    function addMonths(date: Date, months: number): Date {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    }

    export const createPaymentWithMemberships = async (
        member_id: number,
        amount: number,
        payment_date: string,
        payment_mode: string,
        plan_type: string
    ) => {
        
        if (!member_id || isNaN(member_id)) {
            throw new Error("Invalid member_id");
        }
        
        const client = await db.connect();

        try{
            await client.query("BEGIN");

            if (!payment_date) {
                throw new Error("Payment date is required");
            }
            // check memeber exists
            const memberRes = await client.query(
                "SELECT id FROM members WHERE id = $1",
                [member_id]
            );

            if(memberRes.rowCount === 0){
                throw new Error("Member not found");
            }

            const activeMemberships = await client.query(
                `SELECT 1 FROM memberships
                WHERE member_id= $1
                AND end_date >= CURRENT_DATE
                LIMIT 1`,
                [member_id]
            );
            
            if ((activeMemberships.rowCount ?? 0) > 0) {
                throw new Error("Member already has active membership");
            }

            //insert payment
            const paymentRes = await client.query(
                `INSERT INTO payments (member_id, amount, payment_date, payment_mode) 
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [member_id, amount, payment_date, payment_mode]
            );

            console.log("Payment inserted:", paymentRes.rows[0]);

            const membershipRes = await client.query(
                `SELECT end_date
                FROM memberships
                WHERE member_id = $1
                ORDER BY end_date DESC
                LIMIT 1`,
                [member_id]
            );

            let startDate: Date;

            if(
                membershipRes.rowCount === 0 || 
                new Date(membershipRes.rows[0].end_date) < new Date() 
            ) {
                startDate = new Date(payment_date);
            } else {
                startDate = new Date(membershipRes.rows[0].end_date);
            }

            //calculate end_date
            const months = PLAN_DURATION[plan_type];
            if(!months){
                throw new Error("Invalid plan type");
            }

            const endDate = addMonths(startDate, months);

            // Insert memberships
            const membershipInsert = await client.query(
                `INSERT INTO memberships (member_id, plan_type, start_date, end_date) 
                VALUES ($1, $2 , $3 ,$4)
                RETURNING *`,
                [member_id, plan_type, startDate, endDate]
            );

            await client.query("COMMIT");

            return {
                message: "payment and membership created successfully",
                payment: paymentRes.rows[0] ? JSON.parse(JSON.stringify(paymentRes.rows[0])) : "MISSING_FROM_DB",
                membership: membershipInsert.rows[0]
            };
        } catch (error: any) {
            console.error("ERROR:", error.message)
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    };