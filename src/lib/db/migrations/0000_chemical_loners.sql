DO $$ BEGIN
 CREATE TYPE "bankType" AS ENUM('savings', 'investment', 'mortgage', 'credit-card', 'wallet');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "frequency" AS ENUM('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'half-yearly', 'annually');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invType" AS ENUM('equity', 'fund', 'fd');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "parentCategory" AS ENUM('food', 'transportation', 'household', 'utilities', 'health', 'personal', 'income', 'transfer', 'miscellaneous');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "txnType" AS ENUM('expense', 'income', 'transfer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"name" text NOT NULL,
	"bank_type" "bankType" DEFAULT 'savings' NOT NULL,
	"balance" real DEFAULT 0 NOT NULL,
	"is_default_acct" boolean DEFAULT false,
	"as_of_date" text,
	"bank_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"curr_value" real DEFAULT 0 NOT NULL,
	"inv_type" "invType",
	"is_sip" boolean DEFAULT false,
	"nav" real DEFAULT 0,
	"units" real DEFAULT 0,
	"buy_price" real DEFAULT 0,
	"curr_price" real DEFAULT 0,
	"quantity" integer DEFAULT 0,
	"money_control_prefix" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "banks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bank_type" "bankType" DEFAULT 'savings' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parent_category" "parentCategory" DEFAULT 'miscellaneous' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_users" (
	"group_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "id" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"description" varchar(255),
	"txn_type" "txnType" DEFAULT 'expense' NOT NULL,
	"amount" real DEFAULT 0 NOT NULL,
	"category_id" integer NOT NULL,
	"source_id" integer,
	"destination_id" integer,
	"group_id" integer,
	"user_id" text NOT NULL,
	"is_recurring" boolean DEFAULT false,
	"frequency" "frequency",
	"start_date" date,
	"end_date" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_idx" ON "accounts" ("number","bank_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_type_idx" ON "accounts" ("bank_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bank_idx" ON "banks" ("name","bank_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "category_idx" ON "categories" ("name","parent_category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "txn_type_idx" ON "transactions" ("txn_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "txn_category_idx" ON "transactions" ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_users" ADD CONSTRAINT "group_users_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_users" ADD CONSTRAINT "group_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_source_id_accounts_id_fk" FOREIGN KEY ("source_id") REFERENCES "accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destination_id_accounts_id_fk" FOREIGN KEY ("destination_id") REFERENCES "accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
