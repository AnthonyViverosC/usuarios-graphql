const pool = require("../config/db");

function clean(input) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name || !email) throw new Error("Nombre y correo son obligatorios");
  return { name, email };
}

function cleanProduct(input) {
  const name = input.name.trim();
  const description = input.description ? input.description.trim() : null;
  const price = Number(input.price);
  const stock = Number(input.stock);
  if (!name) throw new Error("El nombre del producto es obligatorio");
  if (!Number.isFinite(price) || price <= 0)
    throw new Error("El precio debe ser mayor que cero");
  if (!Number.isInteger(stock) || stock < 0)
    throw new Error("El stock no puede ser negativo");
  return { name, description, price, stock };
}

function productId(id) {
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0)
    throw new Error(`El id del producto no es valido: ${id}`);
  return value;
}

function toProduct(row) {
  return { ...row, price: Number(row.price), stock: Number(row.stock) };
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

  products: async () => {
    const [rows] = await pool.execute(
      "SELECT id, name, description, price, stock FROM products ORDER BY id",
    );
    return rows.map(toProduct);
  },

  product: async ({ id }) => {
    const [rows] = await pool.execute(
      "SELECT id, name, description, price, stock FROM products WHERE id = ?",
      [productId(id)],
    );
    return rows[0] ? toProduct(rows[0]) : null;
  },

  createProduct: async ({ input }) => {
    const { name, description, price, stock } = cleanProduct(input);
    const [result] = await pool.execute(
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
      [name, description, price, stock],
    );
    return { id: result.insertId, name, description, price, stock };
  },

  updateProduct: async ({ id, input }) => {
    const { name, description, price, stock } = cleanProduct(input);
    const [result] = await pool.execute(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
      [name, description, price, stock, productId(id)],
    );
    if (!result.affectedRows) throw new Error(`No existe el producto ${id}`);
    return { id, name, description, price, stock };
  },

  deleteProduct: async ({ id }) => {
    const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [
      productId(id),
    ]);
    return result.affectedRows
      ? { success: true, message: `Producto ${id} eliminado` }
      : { success: false, message: `No existe el producto ${id}` };
  },
};

module.exports = root;
