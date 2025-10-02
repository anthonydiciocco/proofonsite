ALTER TABLE "users" ADD COLUMN "joined_during_beta" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "beta_joined_at" timestamp with time zone;