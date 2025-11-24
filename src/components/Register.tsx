import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const userContext = useUser();
  const register = userContext?.register;
  return (
    <div className="justify-center items-center flex border-2 p-5">
      <form>
        Username:
        <input
          type="text"
          name="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="border-2"
        />
        <br />
        Password:
        <input
          type="text"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border-2"
        />
        <br />
        Email:
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          className="border-2"
        />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (register) {
              if (!username || !password || !email) {
                toast.error("All fields are required");
                return;
              }
              const res = register({
                username: username,
                password: password,
                email: email,
              });
              if (res.success) toast.success(res.message);
              else if (!res.success) toast.error(res.message);
            }
          }}
          className="border-2"
        >
          Register
        </button>
      </form>
    </div>
  );
}
