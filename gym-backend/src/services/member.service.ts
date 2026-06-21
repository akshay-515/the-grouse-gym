import { db } from "../db";

interface Member{
    name: string;
    phone: string;
    age: string;
    gender: string; 
    joined_date: string;
}

export const createMemberService = async (gymId: number, data: Member) => {    
    const { name, phone, age, gender, joined_date } = data;

    if(!name || !phone || !age || !gender || !joined_date){
        throw new Error("All fields are required");
    }

    const result = await db.query(
        `INSERT INTO members (gym_id, name, phone, age, gender, joined_date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [gymId, name, phone, age, gender, joined_date]
    );

    return result.rows[0];
};

export const getAllMembersService = async (gymId: number) => {
    const result = await db.query(
        "SELECT * from members WHERE gym_id = $1 ORDER BY created_at DESC",
        [gymId] 
        
    );
    return result.rows;
};

export const getMemberByIdService = async (id: number, gymId: number) => {
    const result = await db.query(
        "SELECT * FROM members WHERE id=$1 AND gym_id = $2",
        [id, gymId]
    );

    if (result.rows.length === 0){
        throw new Error("Member not found");
    }

    return result.rows[0];
};

export const updateMemberService = async (gymId: number, id: number, data: any) => {
    // const {name, phone, age, gender} = data;

    const existing = await getMemberByIdService(id, gymId);
    if(!existing) {
        throw new Error("Member not found")
    }

    const updatedName = data.name ?? existing.name;
    const updatedPhone = data.phone ?? existing.phone;
    const updatedAge = data.age ?? existing.age;
    const updatedGender = data.gender ?? existing.gender;

    const result = await db.query(
        `UPDATE members
         SET name = $1,
            phone = $2,
            age = $3,
            gender = $4
         WHERE id = $5 
         AND gym_id = $6
         RETURNING *`,
        [updatedName, updatedPhone, updatedAge, updatedGender, id, gymId]
    );

    if (result.rows.length === 0) {
        throw new Error("Member not found");
    }

    return result.rows[0];
};

export const deleteMemberService = async (id: number, gymId: number) => {
    const result = await db.query(
        `DELETE FROM members WHERE id = $1 AND gym_id = $2 RETURNING *`,
        [id, gymId]
    );

    if(result.rows.length === 0){
        throw new Error("Member not found")
    }

    return result.rows[0];
};

// export const getEligibleMembersService = async () => {
//     const result = await db.query(`
//         SELECT m.id, m.name
//         FROM members m
//         LEFT JOIN memberships ms
//           ON m.id = ms.member_id
//           AND ms.end_date >= CURRENT_DATE
//         WHERE ms.id IS NULL
//         ORDER BY m.name ASC`);

//     return result.rows;
// }

export const getEligibleMembersService = async (
    gymId: number,
    memberId?: number
) => {

    let query = `
        SELECT DISTINCT m.id, m.name
        FROM members m
        LEFT JOIN memberships ms
            ON m.id = ms.member_id
            AND ms.end_date >= CURRENT_DATE
        WHERE (
            m.gym_id = $1
            AND ms.id IS NULL
        )
    `;

    const values: any[] = [gymId];

    if (memberId) {
        query += ` OR (m.id = $2 AND m.gym_id = $1)`;
        values.push(memberId);
    }

    query += ` ORDER BY m.name ASC`;

    const result = await db.query(query, values);

    return result.rows;
};