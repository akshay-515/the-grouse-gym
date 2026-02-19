import { generateToken } from './../utils/jwt';
import bcrypt from 'bcrypt';
import {db} from '../db';

export const loginOwner = async (username: string, password: string) => {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return {
      token,
    };
};