require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db, migrate } = require("./db");

function createApp() {
  const app = express();
  const API_TOKEN = process.env.API_TOKEN || "dev-token";

  migrate();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  // Simple bearer auth
  app.use((req, res, next) => {
    const auth = req.headers["authorization"] || "";
    const prefix = "Bearer ";
    if (!auth.startsWith(prefix)) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }
    const token = auth.slice(prefix.length).trim();
    if (token === "" || token !== API_TOKEN) {
      return res.status(401).json({ error: "Invalid token" });
    }
    next();
  });

  function nowISO() {
    return new Date().toISOString().replace("T", " ").replace("Z", "");
  }

  // Helper to format referral response
  function asReferral(row) {
    return {
      id: row.id,
      givenName: row.given_name,
      surname: row.surname,
      email: row.email,
      phone: row.phone,
      homeNameOrNumber: row.home_name_or_number,
      street: row.street,
      suburb: row.suburb,
      state: row.state,
      postcode: row.postcode,
      country: row.country,
      status: row.status,
      notes: row.notes,
      referredBy: row.referred_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Field mapping for database operations
  const FIELD_MAPPINGS = {
    givenName: "given_name",
    surname: "surname",
    email: "email",
    phone: "phone",
    homeNameOrNumber: "home_name_or_number",
    street: "street",
    suburb: "suburb",
    state: "state",
    postcode: "postcode",
    country: "country",
    status: "status",
    notes: "notes",
    referredBy: "referred_by",
  };

  // Validation functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateStatus(status) {
    const validStatuses = ["pending", "contacted", "completed", "declined"];
    return validStatuses.includes(status);
  }

  function validateReferralData(data, isUpdate = false) {
    const errors = [];

    // Required field validation (only for create)
    if (!isUpdate) {
      const requiredFields = [
        "givenName",
        "surname",
        "email",
        "phone",
        "homeNameOrNumber",
        "street",
        "suburb",
        "state",
        "postcode",
      ];
      for (const field of requiredFields) {
        if (!data[field]) {
          errors.push(`${field} is required`);
        }
      }
    }

    // Email validation
    if (data.email && !validateEmail(data.email)) {
      errors.push("Invalid email format");
    }

    // Status validation
    if (data.status && !validateStatus(data.status)) {
      errors.push(
        "Invalid status. Must be one of: pending, contacted, completed, declined"
      );
    }

    return errors;
  }

  function buildUpdateQuery(data) {
    const updates = [];
    const values = [];

    // Process each field
    Object.entries(data).forEach(([camelKey, value]) => {
      if (value !== undefined && FIELD_MAPPINGS[camelKey]) {
        const dbField = FIELD_MAPPINGS[camelKey];
        updates.push(`${dbField} = ?`);
        values.push(value);
      }
    });

    // Always update timestamp
    updates.push("updated_at = ?");
    values.push(nowISO());

    return { updates, values };
  }

  // Routes

  // List all referrals
  app.get("/referrals", (req, res) => {
    try {
      const { status, limit = 5, offset = 0 } = req.query;

      let query = `SELECT * FROM referrals`;
      let params = [];

      if (status) {
        query += ` WHERE status = ?`;
        params.push(status);
      }

      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));

      const rows = db.prepare(query).all(...params);

      // Get total count for pagination
      const countQuery = status
        ? `SELECT COUNT(*) as total FROM referrals WHERE status = ?`
        : `SELECT COUNT(*) as total FROM referrals`;
      const countParams = status ? [status] : [];
      const { total } = db.prepare(countQuery).get(...countParams);

      res.json({
        referrals: rows.map(asReferral),
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + Number(limit) < total,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to list referrals" });
    }
  });

  // Create new referral
  app.post("/referrals", (req, res) => {
    try {
      const data = {
        country: "Australia",
        status: "pending",
        ...req.body,
      };

      // Validate data
      const errors = validateReferralData(data);
      if (errors.length > 0) {
        return res.status(400).json({ error: errors[0] });
      }

      const stmt = db.prepare(`
				INSERT INTO referrals 
				(given_name, surname, email, phone, home_name_or_number, street, suburb, state, postcode, country, status, notes, referred_by, created_at, updated_at) 
				VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
			`);

      const info = stmt.run(
        data.givenName,
        data.surname,
        data.email,
        data.phone,
        data.homeNameOrNumber,
        data.street,
        data.suburb,
        data.state,
        data.postcode,
        data.country,
        data.status,
        data.notes || null,
        data.referredBy || null,
        nowISO(),
        nowISO()
      );

      const row = db
        .prepare(`SELECT * FROM referrals WHERE id=?`)
        .get(info.lastInsertRowid);
      res.status(201).json(asReferral(row));
    } catch (e) {
      console.error(e);
      if (e.message.includes("UNIQUE constraint failed: referrals.email")) {
        return res.status(409).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to create referral" });
    }
  });

  // Update referral by ID
  app.patch("/referrals/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const referralRow = db
        .prepare(`SELECT * FROM referrals WHERE id=?`)
        .get(id);
      if (!referralRow)
        return res.status(404).json({ error: "Referral not found" });

      // Validate data
      const errors = validateReferralData(req.body, true);
      if (errors.length > 0) {
        return res.status(400).json({ error: errors[0] });
      }

      // Build update query
      const { updates, values } = buildUpdateQuery(req.body);

      if (updates.length === 1) {
        // Only timestamp update
        return res.status(400).json({ error: "No fields provided to update" });
      }

      // Add id to the end of values array
      values.push(id);

      const updateQuery = `UPDATE referrals SET ${updates.join(
        ", "
      )} WHERE id = ?`;
      const updateStmt = db.prepare(updateQuery);
      updateStmt.run(...values);

      const row = db.prepare(`SELECT * FROM referrals WHERE id=?`).get(id);
      res.json(asReferral(row));
    } catch (e) {
      console.error(e);
      if (e.message.includes("UNIQUE constraint failed: referrals.email")) {
        return res.status(409).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to update referral" });
    }
  });

  // Delete referral by ID
  app.delete("/referrals/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const info = db.prepare(`DELETE FROM referrals WHERE id=?`).run(id);

      if (info.changes === 0) {
        return res.status(404).json({ error: "Referral not found" });
      }

      res.status(204).end();
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to delete referral" });
    }
  });

  // Get single referral by ID (bonus route for completeness)
  app.get("/referrals/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const row = db.prepare(`SELECT * FROM referrals WHERE id=?`).get(id);

      if (!row) {
        return res.status(404).json({ error: "Referral not found" });
      }

      res.json(asReferral(row));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch referral" });
    }
  });

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

module.exports = { createApp };
