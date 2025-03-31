import { PGlite } from "@electric-sql/pglite";

let db;

export async function initDatabase() {
  if (!db) {
    db = await PGlite.create({ database: "menstrual_cycle_support" });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS cycles (
        id SERIAL PRIMARY KEY,
        start_date DATE,
        end_date DATE,
        notes TEXT
      );
      CREATE TABLE IF NOT EXISTS symptoms (
        id SERIAL PRIMARY KEY,
        cycle_id INTEGER,
        date DATE,
        symptom_type TEXT,
        severity INTEGER,
        notes TEXT,
        FOREIGN KEY (cycle_id) REFERENCES cycles(id)
      );
      CREATE TABLE IF NOT EXISTS dietary_preferences (
        id SERIAL PRIMARY KEY,
        preference_type TEXT
      );
      CREATE TABLE IF NOT EXISTS shared_data (
        id SERIAL PRIMARY KEY,
        partner_id INTEGER,
        data_type TEXT,
        encrypted_data TEXT
      );
    `);
  }
  return db;
}

export async function getDb() {
  if (!db) await initDatabase();
  return db;
}
