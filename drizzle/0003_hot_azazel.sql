CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plan" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"status" text NOT NULL
);
