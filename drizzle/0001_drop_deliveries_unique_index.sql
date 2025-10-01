-- Drop the unique index on deliveries.site_id
-- This was incorrectly created as UNIQUE, preventing multiple deliveries per site
DROP INDEX IF EXISTS "deliveries_site_id_idx";
