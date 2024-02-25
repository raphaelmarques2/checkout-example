DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('created', 'failed', 'processed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"amount" real NOT NULL,
	"status" "payment_status" NOT NULL
);
