CREATE TABLE `business_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(100) NOT NULL,
	`nameRu` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255),
	`descriptionRu` text,
	`descriptionEn` text,
	`descriptionZh` text,
	`ruleType` varchar(50) NOT NULL,
	`conditions` json NOT NULL,
	`actions` json NOT NULL,
	`priority` int NOT NULL DEFAULT 0,
	`mutexGroup` varchar(50),
	`isEnabled` boolean NOT NULL DEFAULT true,
	`validFrom` timestamp,
	`validTo` timestamp,
	`executionCount` int NOT NULL DEFAULT 0,
	`lastExecutedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `business_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `business_rules_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `config_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`configId` int NOT NULL,
	`parentId` int,
	`code` varchar(100) NOT NULL,
	`nameRu` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255),
	`icon` varchar(255),
	`config` json,
	`isEnabled` boolean NOT NULL DEFAULT true,
	`isDefault` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `config_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rule_execution_logs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`ruleId` int NOT NULL,
	`ruleCode` varchar(100) NOT NULL,
	`contextType` varchar(50) NOT NULL,
	`contextId` varchar(100) NOT NULL,
	`isMatched` boolean NOT NULL,
	`isExecuted` boolean NOT NULL,
	`result` json,
	`errorMessage` text,
	`executionTimeMs` int,
	`executedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rule_execution_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `systemConfigs` MODIFY COLUMN `key` varchar(64);--> statement-breakpoint
ALTER TABLE `systemConfigs` MODIFY COLUMN `descriptionZh` text;--> statement-breakpoint
ALTER TABLE `systemConfigs` MODIFY COLUMN `descriptionRu` text;--> statement-breakpoint
ALTER TABLE `systemConfigs` MODIFY COLUMN `descriptionEn` text;--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `code` varchar(100);--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `category` varchar(50);--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `nameRu` varchar(255);--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `nameEn` varchar(255);--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `nameZh` varchar(255);--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `config` json;--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `isEnabled` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `sortOrder` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `validFrom` timestamp;--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `validTo` timestamp;--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `systemConfigs` ADD CONSTRAINT `systemConfigs_code_unique` UNIQUE(`code`);--> statement-breakpoint
CREATE INDEX `idx_rule_type` ON `business_rules` (`ruleType`);--> statement-breakpoint
CREATE INDEX `idx_br_enabled` ON `business_rules` (`isEnabled`);--> statement-breakpoint
CREATE INDEX `idx_priority` ON `business_rules` (`priority`);--> statement-breakpoint
CREATE INDEX `idx_config_id` ON `config_items` (`configId`);--> statement-breakpoint
CREATE INDEX `idx_parent_id` ON `config_items` (`parentId`);--> statement-breakpoint
CREATE INDEX `idx_ci_enabled` ON `config_items` (`isEnabled`);--> statement-breakpoint
CREATE INDEX `idx_log_rule_id` ON `rule_execution_logs` (`ruleId`);--> statement-breakpoint
CREATE INDEX `idx_log_context` ON `rule_execution_logs` (`contextType`,`contextId`);--> statement-breakpoint
CREATE INDEX `idx_log_executed_at` ON `rule_execution_logs` (`executedAt`);--> statement-breakpoint
CREATE INDEX `idx_sys_category` ON `systemConfigs` (`category`);--> statement-breakpoint
CREATE INDEX `idx_sys_code` ON `systemConfigs` (`code`);--> statement-breakpoint
CREATE INDEX `idx_sys_enabled` ON `systemConfigs` (`isEnabled`);