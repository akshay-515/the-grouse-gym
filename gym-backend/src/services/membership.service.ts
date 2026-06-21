import { db } from "../db";

export const getAllMembershipsService = async (
  gymId: number
) => {
  const result = await db.query(
  `
  SELECT
      m.id,
      m.member_id,
      mem.name AS member_name,
      m.plan_type,
      m.start_date,
      m.end_date
  FROM memberships m
  JOIN members mem
      ON mem.id = m.member_id
  WHERE m.gym_id = $1
  ORDER BY m.end_date DESC
  `,
  [gymId]
  );

  return result.rows || [];
}