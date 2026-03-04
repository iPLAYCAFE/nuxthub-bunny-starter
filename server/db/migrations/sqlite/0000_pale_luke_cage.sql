CREATE TABLE `posts` (
	`id` blob(16) PRIMARY KEY NOT NULL,
	`slug` text(21) NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`author_id` blob(16),
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_author_id_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` blob(16) PRIMARY KEY NOT NULL,
	`slug` text(21) NOT NULL,
	`name` text,
	`email` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_slug_unique` ON `users` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_slug_idx` ON `users` (`slug`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` blob(16) PRIMARY KEY NOT NULL,
	`page` text DEFAULT '/' NOT NULL,
	`user_agent` text,
	`ip` text,
	`country` text,
	`visited_at` integer
);
