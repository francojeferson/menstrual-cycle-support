import express from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/menstrual_cycle_support",
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    next();
  });
}

app.post("/api/register", async (req, res) => {
  const { email, password, publicKey } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, public_key) VALUES ($1, $2, $3) RETURNING id",
      [email, hashedPassword, publicKey],
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    const user = result.rows[0];
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, id: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/invitations", verifyToken, async (req, res) => {
  const code = crypto.randomUUID();
  try {
    await pool.query("INSERT INTO invitations (code, primary_user_id) VALUES ($1, $2)", [code, req.userId]);
    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/relationships", verifyToken, async (req, res) => {
  const { code } = req.body;
  try {
    const result = await pool.query("SELECT primary_user_id FROM invitations WHERE code = $1", [code]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Invalid invitation code" });
    const primaryUserId = result.rows[0].primary_user_id;
    await pool.query("INSERT INTO relationships (primary_user_id, partner_user_id, status) VALUES ($1, $2, $3)", [
      primaryUserId,
      req.userId,
      "accepted",
    ]);
    await pool.query("DELETE FROM invitations WHERE code = $1", [code]);
    res.status(201).json({ message: "Relationship created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/users/:id/public-key", async (req, res) => {
  try {
    const result = await pool.query("SELECT public_key FROM users WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ publicKey: result.rows[0].public_key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/cycles", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cycles WHERE user_id = $1", [req.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
