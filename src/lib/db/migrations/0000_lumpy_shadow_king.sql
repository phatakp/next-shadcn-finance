CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`is_default` integer DEFAULT false,
	`as_of_date` text,
	`bank_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`curr_value` real DEFAULT 0 NOT NULL,
	`inv_type` text,
	`is_sip` integer DEFAULT false,
	`nav` real DEFAULT 0,
	`units` real DEFAULT 0,
	`buy_price` real DEFAULT 0,
	`curr_price` real DEFAULT 0,
	`quantity` integer DEFAULT 0,
	`money_control_prefix` text,
	FOREIGN KEY (`type`) REFERENCES `accountTypes`(`type`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bank_id`) REFERENCES `banks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`inv_type`) REFERENCES `invTypes`(`type`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `banks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`type`) REFERENCES `accountTypes`(`type`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'miscellaneous' NOT NULL,
	FOREIGN KEY (`type`) REFERENCES `parentCategories`(`parent`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `accountTypes` (
	`type` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `frequency` (
	`type` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invTypes` (
	`type` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parentCategories` (
	`parent` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `txnTypes` (
	`type` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `group_users` (
	`group_id` integer NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`description` text,
	`type` text DEFAULT 'expense' NOT NULL,
	`amount` real DEFAULT 0 NOT NULL,
	`category_id` integer NOT NULL,
	`source_id` integer,
	`destination_id` integer,
	`group_id` integer,
	`user_id` text NOT NULL,
	`is_recurring` integer DEFAULT false,
	`frequency` text,
	`start_date` integer,
	`end_date` integer,
	FOREIGN KEY (`type`) REFERENCES `txnTypes`(`type`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destination_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`frequency`) REFERENCES `frequency`(`type`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text NOT NULL,
	`image` text,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_idx` ON `accounts` (`number`,`bank_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `account_type_idx` ON `accounts` (`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `bank_idx` ON `banks` (`name`,`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_idx` ON `categories` (`name`,`type`);--> statement-breakpoint
CREATE INDEX `txn_type_idx` ON `transactions` (`type`);--> statement-breakpoint
CREATE INDEX `txn_category_idx` ON `transactions` (`category_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);