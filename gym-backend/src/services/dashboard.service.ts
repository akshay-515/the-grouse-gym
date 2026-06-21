import { db } from "../db";

export const getDashboardStats = async (gymId: number) => {
  const client = await db.connect();

  try {
    const totalMembers = await client.query(  
      `SELECT COUNT(*) FROM members WHERE gym_id = $1`,
      [gymId]
    );

    const activeMemberships = await client.query(
      `
      SELECT COUNT(*)
      FROM memberships
      WHERE gym_id = $1
      AND end_date >= CURRENT_DATE
      `,
      [gymId]
    );

    const expiredMemberships = await client.query(
      `
      SELECT COUNT(*)
      FROM memberships
      WHERE gym_id = $1
      AND end_date < CURRENT_DATE
      `,
      [gymId]
    );

    const expiringSoon = await client.query(
      `
      SELECT COUNT(*) 
      FROM memberships 
      WHERE gym_id = $1
      AND end_date BETWEEN CURRENT_DATE
      AND CURRENT_DATE + INTERVAL '7 days'
      `,
      [gymId]
    );

    const totalRevenue = await client.query(
      `SELECT COALESCE(SUM(amount),0) FROM payments WHERE gym_id = $1`,
      [gymId]
    );

    const monthlyRevenue = await client.query(
      `
      SELECT COALESCE(SUM(amount),0)
      FROM payments
      WHERE gym_id = $1
      AND DATE_TRUNC('month', payment_date) =
      DATE_TRUNC('month', CURRENT_DATE)
      `,
      [gymId]
    );

    const recentPayments = await client.query(
      `SELECT p.id,
        m.name AS member_name,
        p.amount,
        p.payment_date,
        p.payment_mode
      FROM payments p
      JOIN members m
        ON p.member_id = m.id
        AND m.gym_id = p.gym_id
      WHERE p.gym_id = $1
      ORDER BY p.payment_date DESC
      LIMIT 5`,
      [gymId]
    );

    const paymentList = await client.query(
      `SELECT p.id, m.name AS member_name, p.amount, p.payment_date, p.payment_mode
       FROM payments p
       JOIN members m ON p.member_id = m.id
       WHERE p.gym_id = $1
       ORDER BY p.payment_date DESC`,
       [gymId]
    )

    return {
      totalMembers: Number(totalMembers.rows[0].count),
      activeMemberships: Number(activeMemberships.rows[0].count),
      expiredMemberships: Number(expiredMemberships.rows[0].count),
      expiringSoon: Number(expiringSoon.rows[0].count),
      totalRevenue: Number(totalRevenue.rows[0].coalesce),
      monthlyRevenue: Number(monthlyRevenue.rows[0].coalesce),
      recentPayments: recentPayments.rows,
      paymentList: paymentList.rows
    };

  } finally {
    client.release();
  }
};