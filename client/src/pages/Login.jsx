import { useForm } from "react-hook-form";
import { useStore } from "../lib/store";
import api from "../lib/api";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { get } from "idb-keyval";
import { decryptPrivateKey } from "../lib/crypto";

function Login() {
  const { register, handleSubmit } = useForm();
  const setUser = useStore((state) => state.setUser);
  const setPrivateKey = useStore((state) => state.setPrivateKey);
  const [, setLocation] = useLocation();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/login", data);
      const { token } = response;
      localStorage.setItem("token", token);
      setUser({ id: response.id });
      const encryptedPrivateKey = await get("encryptedPrivateKey");
      const privateKey = await decryptPrivateKey(encryptedPrivateKey, data.password);
      setPrivateKey(privateKey);
      setLocation("/");
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" type="email" required />
        <input {...register("password")} placeholder="Password" type="password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
