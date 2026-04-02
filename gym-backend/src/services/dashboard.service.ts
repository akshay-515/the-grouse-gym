import { db } from "../db";

export const getDashboardStats = async () => {
  const client = await db.connect();

  try {
    const totalMembers = await client.query(  
      `SELECT COUNT(*) FROM members`
    );

    const activeMemberships = await client.query(
      `SELECT COUNT(*) FROM memberships WHERE end_date >= CURRENT_DATE`
    );

    const expiredMemberships = await client.query(
      `SELECT COUNT(*) FROM memberships WHERE end_date < CURRENT_DATE`
    );

    const expiringSoon = await client.query(
      `SELECT COUNT(*) 
       FROM memberships 
       WHERE end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'`
    );

    const totalRevenue = await client.query(
      `SELECT COALESCE(SUM(amount),0) FROM payments`
    );

    const monthlyRevenue = await client.query(
      `SELECT COALESCE(SUM(amount),0)
       FROM payments
       WHERE DATE_TRUNC('month', payment_date) =
             DATE_TRUNC('month', CURRENT_DATE)`
    );

    const recentPayments = await client.query(
      `SELECT p.id, m.name AS member_name, p.amount, p.payment_date, p.payment_mode
       FROM payments p
       JOIN members m ON p.member_id = m.id
       ORDER BY p.payment_date DESC
       LIMIT 5`
    );

    const paymentList = await client.query(
      `SELECT p.id, m.name AS member_name, p.amount, p.payment_date, p.payment_mode
       FROM payments p
       JOIN members m ON p.member_id = m.id
       ORDER BY p.payment_date DESC`
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