import bcrypt from "bcrypt";

async function hashPassword() {
    const password = "owner123";
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
}

hashPassword();