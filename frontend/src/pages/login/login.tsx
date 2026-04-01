import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authcontext";
import { loginUser } from "../../api/auth.api";
import toast from "react-hot-toast";
import "./login.css"

export default function Login() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = await loginUser(username, password);
            console.log("data:", data)
            auth?.login(data.token);
            toast.success("Logged in successfully");
            navigate("/dashboard");
        } catch (error) {
            console.log("login error", error);
            toast.error("Invalid credentials")
            // alert("Invalid credentials")
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
                
                <div className="password-wrapper">
                  <input
                  type= {showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  className="toggle-password"
                  onClick={() => {setShowPassword(!showPassword)}}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
                </div>
                
                </div>

                <button type="submit" className="login-btn">
                  Login
                </button>
            </form>
            </div>
        </div>
        );
}