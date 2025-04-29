const { pool } = require('../config/db');

// Create a new order
exports.createOrder = async (req, res) => {
  const { customer_id, total_amount, discount_perc, tax_amount, net_amount, order_items } = req.body;
  const processed_by = req.user.userId;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, total_amount, discount_perc, tax_amount, net_amount, processed_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING order_id, order_date`,
      [customer_id, total_amount, discount_perc, tax_amount, net_amount, processed_by]
    );
    const order_id = orderResult.rows[0].order_id;
    if (Array.isArray(order_items)) {
      for (const item of order_items) {
        // Defensive validation
        if (!item.sku_id || item.quantity <= 0 || item.price < 0) {
          throw new Error('Invalid order item data');
        }
        await client.query(
          `INSERT INTO order_items (order_id, sku_id, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [order_id, item.sku_id, item.quantity, item.price, item.subtotal]
        );
      }
    }
    await client.query('COMMIT');
    res.status(201).json({ order_id });
  } catch (error) {
    await client.query('ROLLBACK');
    // Always send real error message
    res.status(500).json({ error: error.message || String(error) });
  } finally {
    client.release();
  }
};
