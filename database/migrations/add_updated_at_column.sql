-- PersonaFlux Database Migration: Add updated_at column
-- This migration adds the missing updated_at column to the characters table
-- Execute this in your Supabase SQL editor or via API

-- Add updated_at column with default timestamp and automatic updates
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create a trigger to automatically update the updated_at column when records are modified
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing records to have the current timestamp
UPDATE characters 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'characters' 
    AND column_name = 'updated_at';

-- Show sample of updated table structure
SELECT 
    id, 
    character_name, 
    created_at, 
    updated_at 
FROM characters 
LIMIT 5;
