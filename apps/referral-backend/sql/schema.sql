-- Clean Schema for Referral API Only

BEGIN;

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Personal Information
  given_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Address Information
  home_name_or_number TEXT NOT NULL, -- House name or street number
  street TEXT NOT NULL,
  suburb TEXT NOT NULL,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Australia',
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'declined')),
  notes TEXT,
  referred_by TEXT, -- Could be a user ID or name of who made the referral
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  
  -- Create unique constraint on email to prevent duplicates
  UNIQUE(email)
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_referrals_email ON referrals(email);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at);

-- Trigger to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_referrals_timestamp 
  AFTER UPDATE ON referrals
  FOR EACH ROW
BEGIN
  UPDATE referrals SET updated_at = datetime('now') WHERE id = NEW.id;
END;

COMMIT;