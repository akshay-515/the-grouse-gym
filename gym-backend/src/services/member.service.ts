import { db } from "../db";

interface Member{
    name: string;
    phone: string;
    age: string;
    gender: string; 
    joined_date: string;
}

export const createMemberService = async (data: Member) => {    
    const { name, phone, age, gender, joined_date } = data;

    if(!name || !phone || !age || !gender || !joined_date){
        throw new Error("All fields are required");
    }

    const result = await db.query(
        `INSERT INTO members ( name, phone, age, gender, joined_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, phone, age, gender, joined_date]
    );

    return result.rows[0];
};

export const getAllMembersService = async () => {
    const result = await db.query(
        "SELECT * from members ORDER BY created_at DESC" 
        
    );
    return result.rows;
};

export const getMemberByIdService = async (id: number) => {
    const result = await db.query(
        "SELECT * FROM members WHERE id=$1",
        [id]
    );

    if (result.rows.length === 0){
        throw new Error("Member not found");
    }

    return result.rows[0];
};

export const updateMemberService = async (id: number, data: any) => {
    // const {name, phone, age, gender} = data;

    const existing = await getMemberByIdService(id);
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
         RETURNING *`,
        [updatedName, updatedPhone, updatedAge, updatedGender, id]
    );

    if (result.rows.length === 0) {
        throw new Error("Member not found");
    }

    return result.rows[0];
};

export const deleteMemberService = async (id: number) => {
    const result = await db.query(
        `DELETE FROM members WHERE id = $1 RETURNING *`,
        [id]
    );

    if(result.rows.length === 0){
        throw new Error("Member not found")
    }

    return result.rows[0];
};