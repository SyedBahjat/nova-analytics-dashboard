-- Nova Analytics rebrand: add an email column to the user table.
-- The brief requires the signup form to collect an email separately from
-- the username, so we add a nullable, unique email column.

-- AlterTable
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);

-- Unique index
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "user"("email");
