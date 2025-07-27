import { Router, Request, Response } from 'express';
import db from '../db/database';
import { Vendor } from '../models/Vendor';

const router = Router();

// ✅ GET /vendors - List all vendors
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM vendors', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ✅ POST /vendors - Register a new vendor
router.post('/', (req: Request, res: Response) => {
  const { name, contact_person, email, partner_type } = req.body as Vendor;

  if (!name || !contact_person || !email || !partner_type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (partner_type !== 'Supplier' && partner_type !== 'Partner') {
    return res.status(400).json({ error: 'partner_type must be either "Supplier" or "Partner"' });
  }

  const sql = `INSERT INTO vendors (name, contact_person, email, partner_type) 
               VALUES (?, ?, ?, ?)`;

  db.run(sql, [name, contact_person, email, partner_type], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      contact_person,
      email,
      partner_type,
    });
  });
});

// ✅ DELETE /vendors/:id - Delete a vendor
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  db.run('DELETE FROM vendors WHERE id = ?', id, function (err) {
    if (err) {
      console.error('Failed to delete vendor:', err);
      return res.status(500).json({ error: 'Failed to delete vendor' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.status(204).send(); // No content
  });
});

export default router;
