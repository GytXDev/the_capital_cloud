CREATE TABLE IF NOT EXISTS "user_currencies" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"currency" text NOT NULL
);
