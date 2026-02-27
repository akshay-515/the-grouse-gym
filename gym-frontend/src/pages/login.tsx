import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { loginUser } from "../api/auth.api";

export default function Login() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await loginUser(username, password);
            auth?.login(data.token);
            navigate("/dashboard");
        } catch (error) {
            alert("Invalid credentials")
        }
    };

    return (
        <div>
            <h2>Gym Owner Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}