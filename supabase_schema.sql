-- Kerados Waiting List Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS waitlist (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Optional: Add email validation constraint
ALTER TABLE waitlist ADD CONSTRAINT email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- GDPR/CCPA Compliance: Add consent tracking columns
-- Run these ALTER statements in Supabase SQL Editor if table already exists
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_ip VARCHAR(45);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS ccpa_opt_out BOOLEAN DEFAULT FALSE;
