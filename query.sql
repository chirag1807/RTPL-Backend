-- Create employee Table

CREATE TABLE IF NOT EXISTS `Employees` (`empID` INTEGER auto_increment , 
`firstName` VARCHAR(255) NOT NULL, `lastName` VARCHAR(255) NOT NULL, 
`emp_code` VARCHAR(255) NOT NULL, `department` VARCHAR(255) NOT NULL, 
`destination` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL UNIQUE,
`phone` VARCHAR(255) NOT NULL, `company` VARCHAR(255) NOT NULL, `Office` VARCHAR(255) NOT NULL,
`password` VARCHAR(255) NOT NULL, `isDeleted` TINYINT(1) NOT NULL DEFAULT false, 
`createdBy` VARCHAR(255) NOT NULL, `updatedBy` VARCHAR(255) NOT NULL, `deletedBy` VARCHAR(255),
`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME,
RIMARY KEY (`empID`)) ENGINE=InnoDB;

INSERT INTO `Employees` (`firstName`,`lastName`,`emp_code`,`department`,`destination`,`email`,`phone`,`company`,`Office`,`password`,`isDeleted`,`createdBy`,`createdAt`,`updatedAt`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);

SELECT `empID`, `firstName`, `lastName`, `emp_code`, `department`, `destination`, `email`,`phone`, `company`,
`Office`, `password`, `isDeleted`, `createdBy`, `updatedBy`, `deletedBy`,`createdAt`, `updatedAt`, `deletedAt`
FROM `Employees` AS `Employee` 
WHERE (`Employee`.`deletedAt` IS NULL 
AND `Employee`.`email` = 'harsh123@gmail.com');


SELECT * FROM rtpl_database.employees;
INSERT INTO `rtpl_database`.`employees` 
(`emp_i_d`, `first_name`, `last_name`, `emp_code`, `department`, `destination`, `email`, `phone`,
 `company`, `office`, `password`, `is_deleted`, `created_by`) VALUES ('1', 'Harsh', 'Jr', '001', 
 'Sales', 'Sola', 'harsh@gmail.com', '1254789636', 'hrtcl.ltd', 'ftcl', '1234', '0', '1');
 -- ------------------
INSERT INTO `rtpl_database`.`employees`
(`emp_i_d`, `first_name`, `last_name`, `emp_code`, `department`, `destination`, `email`, `phone`, 
`company`, `office`, `password`, `is_deleted`, `created_by`) VALUES ('2', 'delete', 'delete', '002',
 'sales', 'sola', 'delete@gmail.com', '1298765432', 'cvcx', 'cvxcv', '123456789', '0', '1');



