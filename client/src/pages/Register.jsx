import { useForm } from "react-hook-form";
import { useStore } from "../lib/store";
import api from "../lib/api";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { set } from "idb-keyval";
import { generateKeyPair, exportPublicKey, encryptPrivateKey } from "../lib/crypto";

function Register() {
  const { register, handleSubmit } = useForm();
  const setUser = useStore((state) => state.setUser);
  const [, setLocation] = useLocation();

  const onSubmit = async (data) => {
    try {
      const keyPair = await generateKeyPair();
      const publicKeySpki = await exportPublicKey(keyPair.publicKey);
      const encryptedPrivateKey = await encryptPrivateKey(keyPair.privateKey, data.password);
      await set("encryptedPrivateKey", encryptedPrivateKey);
      const response = await api.post("/register", {
        email: data.email,
        password: data.password,
        publicKey: publicKeySpki,
      });
      setUser({ id: response.id });
      setLocation("/login");
      toast.success("Registered successfully");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" type="email" required />
        <input {...register("password")} placeholder="Password" type="password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
