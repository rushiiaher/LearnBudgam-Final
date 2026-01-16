-- Add image_path column if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = "blogs";
SET @columnname = "image_path";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE blogs ADD COLUMN image_path VARCHAR(255)"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add slug column if it doesn't exist (initially nullable)
SET @columnname = "slug";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE blogs ADD COLUMN slug VARCHAR(255)"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update existing slugs if they are NULL or empty
UPDATE blogs SET slug = CONCAT('post-', id) WHERE slug IS NULL OR slug = '';
