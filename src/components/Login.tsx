import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../AuthContext";

interface LoginForm {
  username: string;
  password: string;
  email: string;
}
export default function Login() {
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
    email: "",
  });
  const userContext = useUser();
  const nav = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.username || !form.password || !form.email) {
      toast.error("All fields are required");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: LoginForm) =>
        u.username === form.username &&
        u.password === form.password &&
        u.email === form.email
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }
    userContext?.login(form);
    toast.success("Login successful");
    nav("/");
  };
  return (
    <>
      <div className="justify-center items-center flex border-2 p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            userContext?.login(form);
          }}
        >
          <h2>Login</h2>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="border-2"
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border-2"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border-2"
            />
          </div>
          <button type="submit" onClick={handleSubmit}>
            Login
          </button>
        </form>
      </div>
    </>
  );
}
