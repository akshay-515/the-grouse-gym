import { db } from "../db";

export const getAllMembershipsService = async () => {
    const result = await db.query(
      `SELECT DISTINCT ON (m.member_id)
        m.id,
        m.member_id,
        mem.name AS member_name,
        m.plan_type,
        m.start_date,
        m.end_date
      FROM memberships m
      JOIN members mem ON mem.id = m.member_id
      ORDER BY m.member_id, m.end_date DESC;`
    );

    return result.rows || [];
}