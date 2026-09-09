const pool = require("../config/db");

function clean(input) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name || !email) throw new Error("Nombre y correo son obligatorios");
  return { name, email };
}

const root = {
  users: async () => {
    const [rows] = await pool.execute(
      "SELECT id, name, email FROM users ORDER BY id",
    );
    return rows;
  },

  user: async ({ id }) => {
    const [rows] = await pool.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  createUser: async ({ input }) => {
    const { name, email } = clean(input);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
    );
    return { id: result.insertId, name, email };
  },

  updateUser: async ({ id, input }) => {
    const { name, email } = clean(input);
    const [result] = await pool.execute(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id],
    );
    if (!result.affectedRows) throw new Error(`No existe el usuario ${id}`);
    return { id, name, email };
  },

  deleteUser: async ({ id }) => {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows
      ? { success: true, message: `Usuario ${id} eliminado` }
      : { success: false, message: `No existe el usuario ${id}` };
  },
};

module.exports = root;
