-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: rtpldb
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AppointmentMeetings`
--

DROP TABLE IF EXISTS `AppointmentMeetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AppointmentMeetings` (
  `appointmentMeetingID` int NOT NULL AUTO_INCREMENT,
  `empId` int NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `DeclineReason` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`appointmentMeetingID`),
  KEY `empId` (`empId`),
  CONSTRAINT `AppointmentMeetings_ibfk_1` FOREIGN KEY (`empId`) REFERENCES `Employees` (`empId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AppointmentMeetings`
--

LOCK TABLES `AppointmentMeetings` WRITE;
/*!40000 ALTER TABLE `AppointmentMeetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `AppointmentMeetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Companies`
--

DROP TABLE IF EXISTS `Companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Companies` (
  `companyID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`companyID`),
  UNIQUE KEY `contact` (`contact`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Companies`
--

LOCK TABLES `Companies` WRITE;
/*!40000 ALTER TABLE `Companies` DISABLE KEYS */;
INSERT INTO `Companies` VALUES (1,'Rise and grow group','9876543201','riseandgrow@gmail.com',1,0,'QWERTY',NULL,NULL,'2024-01-07 15:44:35','2024-01-07 15:44:35',NULL),(2,'RTPL','9876543202','rtpl@gmail.com',1,0,'QWERTY',NULL,NULL,'2024-01-07 15:44:53','2024-01-07 15:44:53',NULL);
/*!40000 ALTER TABLE `Companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ConferenceRooms`
--

DROP TABLE IF EXISTS `ConferenceRooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ConferenceRooms` (
  `conferenceRoomID` int NOT NULL AUTO_INCREMENT,
  `officeID` int NOT NULL,
  `conferenceRoomName` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`conferenceRoomID`),
  UNIQUE KEY `conferenceRoomName` (`conferenceRoomName`),
  KEY `officeID` (`officeID`),
  CONSTRAINT `ConferenceRooms_ibfk_1` FOREIGN KEY (`officeID`) REFERENCES `Offices` (`officeID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ConferenceRooms`
--

LOCK TABLES `ConferenceRooms` WRITE;
/*!40000 ALTER TABLE `ConferenceRooms` DISABLE KEYS */;
INSERT INTO `ConferenceRooms` VALUES (1,1,'Room 1','QWERTY',NULL,NULL,'2024-01-07 15:45:57','2024-01-07 15:45:57',NULL),(2,1,'Room 2','QWERTY',NULL,NULL,'2024-01-07 15:46:02','2024-01-07 15:46:02',NULL),(3,1,'Room 3','QWERTY',NULL,NULL,'2024-01-07 15:46:06','2024-01-07 15:46:06',NULL);
/*!40000 ALTER TABLE `ConferenceRooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Departments`
--

DROP TABLE IF EXISTS `Departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Departments` (
  `departmentID` int NOT NULL AUTO_INCREMENT,
  `department` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`departmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Departments`
--

LOCK TABLES `Departments` WRITE;
/*!40000 ALTER TABLE `Departments` DISABLE KEYS */;
INSERT INTO `Departments` VALUES (1,'HR & ADMIN',1,0,'QWERTY',NULL,NULL,'2024-01-07 15:47:08','2024-01-07 15:47:08',NULL),(2,'Audit',1,0,'QWERTY',NULL,NULL,'2024-01-07 15:47:32','2024-01-07 15:47:32',NULL);
/*!40000 ALTER TABLE `Departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Designations`
--

DROP TABLE IF EXISTS `Designations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Designations` (
  `designationID` int NOT NULL AUTO_INCREMENT,
  `designation` varchar(255) DEFAULT NULL,
  `departmentID` int DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`designationID`),
  KEY `departmentID` (`departmentID`),
  CONSTRAINT `Designations_ibfk_1` FOREIGN KEY (`departmentID`) REFERENCES `Departments` (`departmentID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Designations`
--

LOCK TABLES `Designations` WRITE;
/*!40000 ALTER TABLE `Designations` DISABLE KEYS */;
INSERT INTO `Designations` VALUES (1,'Assistant Clerk',1,1,0,'QWERTY',NULL,NULL,'2024-01-07 15:48:02','2024-01-07 15:48:02',NULL),(2,'Executive - HR',1,1,0,'QWERTY',NULL,NULL,'2024-01-07 15:48:30','2024-01-07 15:48:30',NULL);
/*!40000 ALTER TABLE `Designations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmployeeRoles`
--

DROP TABLE IF EXISTS `EmployeeRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmployeeRoles` (
  `roleID` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`roleID`),
  UNIQUE KEY `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeeRoles`
--

LOCK TABLES `EmployeeRoles` WRITE;
/*!40000 ALTER TABLE `EmployeeRoles` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmployeeRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employees`
--

DROP TABLE IF EXISTS `Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employees` (
  `empId` int NOT NULL AUTO_INCREMENT,
  `empProfileImg` varchar(255) DEFAULT NULL,
  `empIdCard` varchar(255) DEFAULT NULL,
  `empAadharCard` varchar(255) DEFAULT NULL,
  `permissions` varchar(255) DEFAULT NULL,
  `aadharNumber` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `emp_code` varchar(255) NOT NULL,
  `birthDate` date DEFAULT NULL,
  `joiningDate` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `featureString` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `isRecept` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleID` int DEFAULT NULL,
  `companyID` int DEFAULT NULL,
  `officeID` int DEFAULT NULL,
  `departmentID` int DEFAULT NULL,
  `designationID` int DEFAULT NULL,
  PRIMARY KEY (`empId`),
  UNIQUE KEY `aadharNumber` (`aadharNumber`),
  UNIQUE KEY `emp_code` (`emp_code`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `roleID` (`roleID`),
  KEY `companyID` (`companyID`),
  KEY `officeID` (`officeID`),
  KEY `departmentID` (`departmentID`),
  KEY `designationID` (`designationID`),
  CONSTRAINT `Employees_ibfk_1` FOREIGN KEY (`roleID`) REFERENCES `EmployeeRoles` (`roleID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Employees_ibfk_2` FOREIGN KEY (`companyID`) REFERENCES `Companies` (`companyID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Employees_ibfk_3` FOREIGN KEY (`officeID`) REFERENCES `Offices` (`officeID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Employees_ibfk_4` FOREIGN KEY (`departmentID`) REFERENCES `Departments` (`departmentID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Employees_ibfk_5` FOREIGN KEY (`designationID`) REFERENCES `Designations` (`designationID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
INSERT INTO `Employees` VALUES (1,'https://res.cloudinary.com/dupko07wd/image/upload/v1704643312/RTPL_DOCS/rbqj6ya5mevf5rrgkhuj.png','https://res.cloudinary.com/dupko07wd/image/upload/v1704643310/RTPL_DOCS/sy8gyhu3lc8indph8z3m.png','https://res.cloudinary.com/dupko07wd/image/upload/v1704643309/RTPL_DOCS/bsdjsbyh6yunyw49w7fi.png',NULL,'123456789012','Chirag','Makwana','Chirag123','2003-07-18','2024-01-02','chiragmakwana1807@gmail.com',NULL,'9327963015','$2b$10$oCljet76oJhdHkVLv/1BYuKZ5rQH1xtBQ6F1e9LKTafH0ITY1n/22',0,0,0,0,'Self',NULL,NULL,'2024-01-07 16:01:53','2024-01-07 16:01:53',NULL,1,1,1,1),(2,'https://res.cloudinary.com/dupko07wd/image/upload/v1704644713/RTPL_DOCS/nuufai6ffhffrlf1cmcn.png','https://res.cloudinary.com/dupko07wd/image/upload/v1704644712/RTPL_DOCS/blxzji20iv94c0te8uw0.png','https://res.cloudinary.com/dupko07wd/image/upload/v1704644711/RTPL_DOCS/c25rafljoupeckbh2ce1.png',NULL,'909090909092','Siddaraj','Gadhvi','QWERTY2',NULL,NULL,'webercodestechnology2@gmail.com',NULL,'8733823443','$2b$10$r/v0vl4t1tlcvK6B5arZa.P5VS657vOsR031oNKsnJrFVl3peX5/C',0,1,1,0,'QWERTY',NULL,NULL,'2024-01-07 16:25:14','2024-01-07 16:25:14',NULL,NULL,NULL,NULL,NULL),(4,'https://res.cloudinary.com/dupko07wd/image/upload/v1704728445/RTPL_DOCS/pmrdajmb4dq6cslhf6wr.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704728444/RTPL_DOCS/eg4f39ui3mvuj0wdya3z.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704728443/RTPL_DOCS/wp1nllswzbplpwy90e9o.jpg',NULL,'323456789012','Ankit','Bose','Ankit123','2003-07-18','2024-01-02','abinfo2310@gmail.com',NULL,'9687950924','$2b$10$jrQN/IuN5m5l0lvNVOqK2eyPJiotLtZ35f3d28k93/34l//W3m1hW',0,0,1,0,'Self','QWERTY1',NULL,'2024-01-08 15:40:45','2024-01-08 15:51:23',NULL,1,1,1,1),(5,'https://res.cloudinary.com/dupko07wd/image/upload/v1704799116/RTPL_DOCS/yd6qrm9j9fbtuv7gfwwz.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704799116/RTPL_DOCS/isuyymkcjqvqyoxfjqza.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704799115/RTPL_DOCS/envmmalv6rczzn1poxw3.jpg',NULL,'909090909123','test','ankit','QWERTK3',NULL,NULL,'hiresav535@regapts.com',NULL,'8733823449','$2b$10$VIuOI60xuLiG/DPPWEi85uBjf1hd4WaedBF2vsuEvDwoeNXVWQFIO',1,0,1,0,'QWERTY',NULL,NULL,'2024-01-09 11:18:37','2024-01-09 11:18:37',NULL,NULL,NULL,NULL,NULL),(6,'https://res.cloudinary.com/dupko07wd/image/upload/v1704810639/RTPL_DOCS/ccd6r725sk2u1ndzcxet.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704810638/RTPL_DOCS/dzvcrko6ry71ih0r3cjd.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704810637/RTPL_DOCS/v8khwl65vfzvahc2osxw.jpg',NULL,'123456712012','test','ph','testingcode2','2003-07-18','2024-01-02','test123@gmail.com',NULL,'9327963014','$2b$10$kNuLTdJPYbISFHT0xPT/nusjhC7IVhK.lXTto0Cq.euSzw4YGTdOa',0,1,1,0,'QWERTY',NULL,NULL,'2024-01-09 14:30:40','2024-01-09 14:30:40',NULL,1,1,1,1);
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InternalTeamSelections`
--

DROP TABLE IF EXISTS `InternalTeamSelections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InternalTeamSelections` (
  `internalTeamSelectID` int NOT NULL AUTO_INCREMENT,
  `meetingID` int NOT NULL,
  `empId` int NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `DeclineReason` varchar(255) DEFAULT NULL,
  `isAttended` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`internalTeamSelectID`),
  KEY `meetingID` (`meetingID`),
  KEY `empId` (`empId`),
  CONSTRAINT `InternalTeamSelections_ibfk_1` FOREIGN KEY (`meetingID`) REFERENCES `Meetings` (`meetingID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `InternalTeamSelections_ibfk_2` FOREIGN KEY (`empId`) REFERENCES `Employees` (`empId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InternalTeamSelections`
--

LOCK TABLES `InternalTeamSelections` WRITE;
/*!40000 ALTER TABLE `InternalTeamSelections` DISABLE KEYS */;
/*!40000 ALTER TABLE `InternalTeamSelections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MeetingModes`
--

DROP TABLE IF EXISTS `MeetingModes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MeetingModes` (
  `meetingModeID` int NOT NULL AUTO_INCREMENT,
  `meetingMode` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`meetingModeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MeetingModes`
--

LOCK TABLES `MeetingModes` WRITE;
/*!40000 ALTER TABLE `MeetingModes` DISABLE KEYS */;
INSERT INTO `MeetingModes` VALUES (1,'Zoom',1,0,'QWERTY',NULL,NULL,'2024-01-07 14:53:23','2024-01-07 14:53:23',NULL),(2,'Google Meet',1,0,'QWERTY',NULL,NULL,'2024-01-07 14:54:09','2024-01-07 14:54:09',NULL),(3,'Offline',1,0,'QWERTY',NULL,NULL,'2024-01-07 14:54:36','2024-01-07 14:54:36',NULL);
/*!40000 ALTER TABLE `MeetingModes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MeetingTypes`
--

DROP TABLE IF EXISTS `MeetingTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MeetingTypes` (
  `meetingTypeID` int NOT NULL AUTO_INCREMENT,
  `meetingType` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`meetingTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MeetingTypes`
--

LOCK TABLES `MeetingTypes` WRITE;
/*!40000 ALTER TABLE `MeetingTypes` DISABLE KEYS */;
INSERT INTO `MeetingTypes` VALUES (1,'Outer Meeting',1,0,'QWERTY1',NULL,NULL,'2024-01-07 15:43:19','2024-01-07 15:43:19',NULL),(2,'Visitor Meeting',1,0,'QWERTY1',NULL,NULL,'2024-01-07 15:43:27','2024-01-07 15:43:27',NULL),(3,'Internal Meeting',1,0,'QWERTY1',NULL,NULL,'2024-01-07 15:43:33','2024-01-07 15:43:33',NULL);
/*!40000 ALTER TABLE `MeetingTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Meetings`
--

DROP TABLE IF EXISTS `Meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Meetings` (
  `meetingID` int NOT NULL AUTO_INCREMENT,
  `empId` int DEFAULT NULL,
  `officeID` int DEFAULT NULL,
  `requestID` int DEFAULT NULL,
  `appointmentMeetingID` int DEFAULT NULL,
  `outerMeetingID` int DEFAULT NULL,
  `meetingTypeID` int DEFAULT NULL,
  `meetingModeID` int DEFAULT NULL,
  `conferenceRoomID` int DEFAULT NULL,
  `rescConferenceRoomID` int DEFAULT NULL,
  `MeetingPurpose` varchar(255) NOT NULL,
  `meetingDate` date NOT NULL,
  `meetingStartTime` time DEFAULT NULL,
  `meetingEndTime` time DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isReschedule` tinyint(1) NOT NULL DEFAULT '0',
  `rescMeetingDate` date DEFAULT NULL,
  `rescMeetingStartTime` time DEFAULT NULL,
  `startedAt` time DEFAULT NULL,
  `stoppedAt` time DEFAULT NULL,
  `meetingDoc` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `rescMeetingEndTime` time DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `reqMeetingID` int DEFAULT NULL,
  PRIMARY KEY (`meetingID`),
  KEY `empId` (`empId`),
  KEY `officeID` (`officeID`),
  KEY `requestID` (`requestID`),
  KEY `appointmentMeetingID` (`appointmentMeetingID`),
  KEY `outerMeetingID` (`outerMeetingID`),
  KEY `meetingTypeID` (`meetingTypeID`),
  KEY `meetingModeID` (`meetingModeID`),
  KEY `conferenceRoomID` (`conferenceRoomID`),
  KEY `rescConferenceRoomID` (`rescConferenceRoomID`),
  KEY `reqMeetingID` (`reqMeetingID`),
  CONSTRAINT `Meetings_ibfk_1` FOREIGN KEY (`empId`) REFERENCES `Employees` (`empId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_10` FOREIGN KEY (`reqMeetingID`) REFERENCES `RequestMeetings` (`reqMeetingID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_2` FOREIGN KEY (`officeID`) REFERENCES `Offices` (`officeID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_3` FOREIGN KEY (`requestID`) REFERENCES `RequestMeetings` (`reqMeetingID`),
  CONSTRAINT `Meetings_ibfk_4` FOREIGN KEY (`appointmentMeetingID`) REFERENCES `AppointmentMeetings` (`appointmentMeetingID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_5` FOREIGN KEY (`outerMeetingID`) REFERENCES `OuterMeetings` (`outerMeetingID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_6` FOREIGN KEY (`meetingTypeID`) REFERENCES `MeetingTypes` (`meetingTypeID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_7` FOREIGN KEY (`meetingModeID`) REFERENCES `MeetingModes` (`meetingModeID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_8` FOREIGN KEY (`conferenceRoomID`) REFERENCES `ConferenceRooms` (`conferenceRoomID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Meetings_ibfk_9` FOREIGN KEY (`rescConferenceRoomID`) REFERENCES `ConferenceRooms` (`conferenceRoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Meetings`
--

LOCK TABLES `Meetings` WRITE;
/*!40000 ALTER TABLE `Meetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Offices`
--

DROP TABLE IF EXISTS `Offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Offices` (
  `officeID` int NOT NULL AUTO_INCREMENT,
  `companyID` int DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`officeID`),
  KEY `companyID` (`companyID`),
  CONSTRAINT `Offices_ibfk_1` FOREIGN KEY (`companyID`) REFERENCES `Companies` (`companyID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Offices`
--

LOCK TABLES `Offices` WRITE;
/*!40000 ALTER TABLE `Offices` DISABLE KEYS */;
INSERT INTO `Offices` VALUES (1,1,'1216-1218, Zion Z1, Nr. Avalon Hotel, Sindhu Bhavan Marg, Bodakdev, Ahmedabad – 380054',1,0,'QWERTY',NULL,NULL,'2024-01-07 15:45:28','2024-01-07 15:45:28',NULL);
/*!40000 ALTER TABLE `Offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OuterMeetings`
--

DROP TABLE IF EXISTS `OuterMeetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OuterMeetings` (
  `outerMeetingID` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(255) NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `clientDesignation` varchar(255) NOT NULL,
  `clientContact` varchar(255) NOT NULL,
  `clientVenue` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `DeclineReason` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`outerMeetingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OuterMeetings`
--

LOCK TABLES `OuterMeetings` WRITE;
/*!40000 ALTER TABLE `OuterMeetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `OuterMeetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReqMeetDetailsByRecps`
--

DROP TABLE IF EXISTS `ReqMeetDetailsByRecps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReqMeetDetailsByRecps` (
  `reqMeetDetailsID` int NOT NULL AUTO_INCREMENT,
  `companyID` int NOT NULL,
  `officeID` int NOT NULL,
  `departmentID` int NOT NULL,
  `designationID` int NOT NULL,
  `emp_name` varchar(255) NOT NULL,
  `emp_code` varchar(255) NOT NULL,
  `TokenNumber` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`reqMeetDetailsID`),
  UNIQUE KEY `TokenNumber` (`TokenNumber`),
  KEY `companyID` (`companyID`),
  KEY `officeID` (`officeID`),
  KEY `departmentID` (`departmentID`),
  KEY `designationID` (`designationID`),
  CONSTRAINT `ReqMeetDetailsByRecps_ibfk_1` FOREIGN KEY (`companyID`) REFERENCES `Companies` (`companyID`) ON UPDATE CASCADE,
  CONSTRAINT `ReqMeetDetailsByRecps_ibfk_2` FOREIGN KEY (`officeID`) REFERENCES `Offices` (`officeID`) ON UPDATE CASCADE,
  CONSTRAINT `ReqMeetDetailsByRecps_ibfk_3` FOREIGN KEY (`departmentID`) REFERENCES `Departments` (`departmentID`) ON UPDATE CASCADE,
  CONSTRAINT `ReqMeetDetailsByRecps_ibfk_4` FOREIGN KEY (`designationID`) REFERENCES `Designations` (`designationID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReqMeetDetailsByRecps`
--

LOCK TABLES `ReqMeetDetailsByRecps` WRITE;
/*!40000 ALTER TABLE `ReqMeetDetailsByRecps` DISABLE KEYS */;
INSERT INTO `ReqMeetDetailsByRecps` VALUES (1,1,1,1,1,'Chirag','Chirag123','ABC125','2024-01-07 16:27:42','2024-01-07 16:27:42',NULL);
/*!40000 ALTER TABLE `ReqMeetDetailsByRecps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReqMeetVisitorDetails`
--

DROP TABLE IF EXISTS `ReqMeetVisitorDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReqMeetVisitorDetails` (
  `visitorID` int NOT NULL AUTO_INCREMENT,
  `reqMeetingID` int DEFAULT NULL,
  `vFirstName` varchar(255) NOT NULL,
  `vLastName` varchar(255) NOT NULL,
  `vDateOfBirth` date DEFAULT NULL,
  `vAnniversaryDate` date DEFAULT NULL,
  `vDesignation` varchar(255) NOT NULL,
  `vImage` varchar(255) NOT NULL,
  `vIDDoc` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`visitorID`),
  KEY `reqMeetingID` (`reqMeetingID`),
  CONSTRAINT `ReqMeetVisitorDetails_ibfk_1` FOREIGN KEY (`reqMeetingID`) REFERENCES `RequestMeetings` (`reqMeetingID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReqMeetVisitorDetails`
--

LOCK TABLES `ReqMeetVisitorDetails` WRITE;
/*!40000 ALTER TABLE `ReqMeetVisitorDetails` DISABLE KEYS */;
INSERT INTO `ReqMeetVisitorDetails` VALUES (1,2,'Ridham','Chauhan','2003-07-09',NULL,'software engineer','https://res.cloudinary.com/dupko07wd/image/upload/v1704643438/RTPL_DOCS/j39e76cvuoewcop6fpoa.png','https://res.cloudinary.com/dupko07wd/image/upload/v1704643437/RTPL_DOCS/qkn77xupvghoki3mmq1v.png','2024-01-07 16:03:58','2024-01-07 16:03:58',NULL),(2,3,'test','testman','2002-10-24',NULL,'tester','https://res.cloudinary.com/dupko07wd/image/upload/v1704645413/RTPL_DOCS/jfndreal0fh8mwgl6ogj.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704645412/RTPL_DOCS/ezhqkdtbujmzexcholuv.jpg','2024-01-07 16:36:53','2024-01-07 16:36:53',NULL),(3,4,'test','testman','2002-10-24',NULL,'tester','https://res.cloudinary.com/dupko07wd/image/upload/v1704645449/RTPL_DOCS/wzoi6uhg2bifqaewspgo.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704645448/RTPL_DOCS/onhmvqmqz5pqnqfmzlf3.jpg','2024-01-07 16:37:29','2024-01-07 16:37:29',NULL),(4,6,'test','testman','2002-10-24',NULL,'tester','https://res.cloudinary.com/dupko07wd/image/upload/v1704660741/RTPL_DOCS/e7b2p4wsssfpqkiaanhs.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704660741/RTPL_DOCS/n71jvgfbs60ojkzxupqi.jpg','2024-01-07 20:52:22','2024-01-07 20:52:22',NULL),(5,9,'test','testman','2002-10-24',NULL,'tester','https://res.cloudinary.com/dupko07wd/image/upload/v1704661048/RTPL_DOCS/lnjtdosvompj3bv8y6ot.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704661047/RTPL_DOCS/gfpcbybrvvn5wyfczjti.jpg','2024-01-07 20:57:28','2024-01-07 20:57:28',NULL),(6,10,'test','testman','2002-10-24',NULL,'tester','https://res.cloudinary.com/dupko07wd/image/upload/v1704661055/RTPL_DOCS/mdmiv5iqkdp2xrje4f6w.jpg','https://res.cloudinary.com/dupko07wd/image/upload/v1704661055/RTPL_DOCS/e8tsf4w8t0mekj3omavs.jpg','2024-01-07 20:57:36','2024-01-07 20:57:36',NULL);
/*!40000 ALTER TABLE `ReqMeetVisitorDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RequestMeetings`
--

DROP TABLE IF EXISTS `RequestMeetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RequestMeetings` (
  `reqMeetingID` int NOT NULL AUTO_INCREMENT,
  `vCompanyName` varchar(255) NOT NULL,
  `vCompanyAddress` varchar(255) NOT NULL,
  `vCompanyContact` varchar(255) NOT NULL,
  `vCompanyEmail` varchar(255) NOT NULL,
  `purposeOfMeeting` varchar(255) NOT NULL,
  `empId` int DEFAULT NULL,
  `reqMeetDetailsID` int DEFAULT NULL,
  `ReqStatus` varchar(255) NOT NULL DEFAULT 'Pending',
  `DeclineReason` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`reqMeetingID`),
  KEY `empId` (`empId`),
  KEY `reqMeetDetailsID` (`reqMeetDetailsID`),
  CONSTRAINT `RequestMeetings_ibfk_1` FOREIGN KEY (`empId`) REFERENCES `Employees` (`empId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `RequestMeetings_ibfk_2` FOREIGN KEY (`reqMeetDetailsID`) REFERENCES `ReqMeetDetailsByRecps` (`reqMeetDetailsID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RequestMeetings`
--

LOCK TABLES `RequestMeetings` WRITE;
/*!40000 ALTER TABLE `RequestMeetings` DISABLE KEYS */;
INSERT INTO `RequestMeetings` VALUES (1,'Riveredge','Thaltej','9876543201','riveredge@gmail.com','to dev s.w.',1,NULL,'Pending',NULL,'2024-01-07 16:02:58','2024-01-07 16:02:58',NULL),(2,'Riveredge','Thaltej','9876543201','riveredge@gmail.com','to dev s.w.',1,1,'ReceptionistAccepted',NULL,'2024-01-07 16:03:56','2024-01-07 16:27:42',NULL),(3,'test','test add','9999999999','test@gmail.com','testing api',1,NULL,'ReceptionistAccepted',NULL,'2024-01-07 16:36:51','2024-01-07 19:21:21',NULL),(4,'test','test add','9999999999','test@gmail.com','testing api',1,NULL,'ReceptionistAccepted',NULL,'2024-01-07 16:37:27','2024-01-07 16:54:41',NULL),(5,'test','test add','9999999999','test@gmail.com','testing api',1,NULL,'Pending',NULL,'2024-01-07 20:51:20','2024-01-07 20:51:20',NULL),(6,'test','test add','9999999999','test@gmail.com','testing api',1,NULL,'Pending',NULL,'2024-01-07 20:52:20','2024-01-07 20:52:20',NULL),(7,'test','twat addr','9764665986','test@gmail.com','testting purpose',2,NULL,'Pending',NULL,'2024-01-07 20:54:10','2024-01-07 20:54:10',NULL),(8,'test','twat addr','9764665986','test@gmail.com','testting purpose',2,NULL,'Pending',NULL,'2024-01-07 20:55:24','2024-01-07 20:55:24',NULL),(9,'test','test add','9999999999','test@gmail.com','testing api',1,NULL,'Pending',NULL,'2024-01-07 20:57:26','2024-01-07 20:57:26',NULL),(10,'test','test add','9999999999','test@gmail.com','testing api',1,NULL,'Pending',NULL,'2024-01-07 20:57:34','2024-01-07 20:57:34',NULL);
/*!40000 ALTER TABLE `RequestMeetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TimeSlots`
--

DROP TABLE IF EXISTS `TimeSlots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TimeSlots` (
  `timeSlotID` int NOT NULL AUTO_INCREMENT,
  `meetingID` int NOT NULL,
  `meetingStartTime` time DEFAULT NULL,
  `meetingEndTime` time DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`timeSlotID`),
  KEY `meetingID` (`meetingID`),
  CONSTRAINT `TimeSlots_ibfk_1` FOREIGN KEY (`meetingID`) REFERENCES `Meetings` (`meetingID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TimeSlots`
--

LOCK TABLES `TimeSlots` WRITE;
/*!40000 ALTER TABLE `TimeSlots` DISABLE KEYS */;
/*!40000 ALTER TABLE `TimeSlots` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-09 17:38:01
