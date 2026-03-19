import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authcontext";
import { loginUser } from "../../api/auth.api";
import "./login.css"

export default function Login() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
        <div className="login-container">
            <div className="login-card">
            <h2>Gym Owner Login</h2>
            <p className="login-subtext">Manage your gym efficiently</p>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>

                <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>

                <button type="submit" className="login-btn">
                Login
                </button>
            </form>
            </div>
        </div>
        );
}