CREATE TABLE `delivery_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int,
	`deliveryEnabled` boolean NOT NULL DEFAULT true,
	`pickupEnabled` boolean NOT NULL DEFAULT true,
	`deliveryFee` decimal(10,2) NOT NULL DEFAULT '0.00',
	`freeDeliveryThreshold` decimal(10,2),
	`minOrderAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`deliveryRadius` int NOT NULL DEFAULT 5000,
	`estimatedDeliveryTime` int NOT NULL DEFAULT 30,
	`estimatedPickupTime` int NOT NULL DEFAULT 15,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `delivery_config_id` PRIMARY KEY(`id`)
);
