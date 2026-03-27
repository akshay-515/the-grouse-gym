import bcrypt from "bcrypt";

(async () => {
  const hash = await bcrypt.hash("owner123", 10);
  console.log("HASH:", hash);
})();