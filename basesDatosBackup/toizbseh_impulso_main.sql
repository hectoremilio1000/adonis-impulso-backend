-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 29, 2025 at 08:04 AM
-- Server version: 8.0.35
-- PHP Version: 8.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toizbseh_impulso_main`
--

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema`
--

CREATE TABLE `adonis_schema` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `adonis_schema`
--

INSERT INTO `adonis_schema` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, 'database/migrations/1727829981884_create_users_table', 1, '2024-12-03 20:53:49'),
(2, 'database/migrations/1727829981891_create_access_tokens_table', 1, '2024-12-03 20:53:50'),
(3, 'database/migrations/1727832780633_create_roles_table', 1, '2024-12-03 20:53:50'),
(4, 'database/migrations/1727833249730_create_newusers_table', 1, '2024-12-03 20:53:52'),
(5, 'database/migrations/1728076088223_create_plans_table', 1, '2024-12-03 20:53:52'),
(6, 'database/migrations/1728079499253_create_modules_table', 1, '2024-12-03 20:53:53'),
(7, 'database/migrations/1728338897894_create_companies_table', 1, '2024-12-03 20:53:54'),
(8, 'database/migrations/1728340412517_create_sedes_table', 1, '2024-12-03 20:53:55'),
(9, 'database/migrations/1728341018866_create_users_sedes_table', 1, '2024-12-03 20:53:56'),
(10, 'database/migrations/1729653071645_create_plans_modules_table', 1, '2024-12-03 20:53:57'),
(11, 'database/migrations/1731949737591_create_successcases_table', 1, '2024-12-03 20:53:58'),
(12, 'database/migrations/1731950109052_create_sections_table', 1, '2024-12-03 20:53:59'),
(13, 'database/migrations/1732005320393_create_prospects_table', 1, '2024-12-03 20:53:59'),
(14, 'database/migrations/1732571633237_create_subscriptions_table', 1, '2024-12-03 20:54:01'),
(15, 'database/migrations/1732572873421_create_transacctions_table', 1, '2024-12-03 20:54:02'),
(16, 'database/migrations/1735229204478_create_users_calendlies_table', 2, '2025-01-27 21:59:34'),
(17, 'database/migrations/1736892678401_create_questions_table', 2, '2025-01-27 21:59:35'),
(18, 'database/migrations/1736895047220_create_options_table', 2, '2025-01-27 21:59:36'),
(19, 'database/migrations/1736958050903_create_responses_table', 2, '2025-01-27 21:59:37'),
(20, 'database/migrations/1736959993161_create_recommendations_table', 2, '2025-01-27 21:59:38'),
(21, 'database/migrations/1737578085515_create_candidates_table', 2, '2025-01-27 21:59:39'),
(22, 'database/migrations/1737579752056_create_exams_table', 2, '2025-01-27 21:59:39'),
(23, 'database/migrations/1737580610523_create_questions_candidates_table', 2, '2025-01-27 21:59:40'),
(24, 'database/migrations/1737582979113_create_answer_candidates_table', 2, '2025-01-27 21:59:41');

-- --------------------------------------------------------

--
-- Table structure for table `adonis_schema_versions`
--

CREATE TABLE `adonis_schema_versions` (
  `version` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `adonis_schema_versions`
--

INSERT INTO `adonis_schema_versions` (`version`) VALUES
(2);

-- --------------------------------------------------------

--
-- Table structure for table `answer_candidates`
--

CREATE TABLE `answer_candidates` (
  `id` int UNSIGNED NOT NULL,
  `candidate_id` int UNSIGNED NOT NULL,
  `question_id` int UNSIGNED NOT NULL,
  `selected_answer` varchar(1) COLLATE utf8mb3_unicode_ci NOT NULL,
  `answer_weight` float(8,2) DEFAULT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `attempt` int NOT NULL DEFAULT '1',
  `exam_id` int UNSIGNED NOT NULL,
  `exam_name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `exam_version` int NOT NULL,
  `question_weight` float(8,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_access_tokens`
--

CREATE TABLE `auth_access_tokens` (
  `id` int UNSIGNED NOT NULL,
  `tokenable_id` int UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `hash` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `auth_access_tokens`
--

INSERT INTO `auth_access_tokens` (`id`, `tokenable_id`, `type`, `name`, `hash`, `abilities`, `created_at`, `updated_at`, `last_used_at`, `expires_at`) VALUES
(1, 3, 'auth_token', NULL, 'eafc23022dd73268ef5c3512e1a9fc69811c70a650171b06d3bea3b38a138e57', '[\"*\"]', '2024-12-16 05:20:40', '2024-12-16 05:20:40', NULL, '2025-01-15 05:20:40'),
(2, 3, 'auth_token', NULL, '5d8dfee0d61b34a8d1006e592d8daf7f726133f8574972c73f007547db577e17', '[\"*\"]', '2024-12-16 05:21:44', '2024-12-16 05:21:44', '2024-12-16 05:32:28', NULL),
(3, 3, 'auth_token', NULL, '1fcefd0c50cc1e455d8aaa77e03328979103caf8965e47632260e7ef4eec05f1', '[\"*\"]', '2024-12-16 06:34:15', '2024-12-16 06:34:15', '2024-12-16 19:42:59', NULL),
(4, 3, 'auth_token', NULL, '7a1cfa57b80bec67133c2a2c59a69eeec12370b1dd2b476a49dd28fd0725265e', '[\"*\"]', '2024-12-16 07:07:04', '2024-12-16 07:07:04', '2024-12-16 07:12:14', NULL),
(6, 3, 'auth_token', NULL, '01ab62e2b16df84cc1a1b97955542b276130d13de7424b044a3905307f4e76ca', '[\"*\"]', '2024-12-17 22:33:33', '2024-12-17 22:33:33', '2024-12-17 22:33:39', NULL),
(7, 3, 'auth_token', NULL, '60f7830a0ccb49f9d5ceb57d7f92c5cd83f6422802cc4f69359891b62344b7e8', '[\"*\"]', '2024-12-19 01:32:22', '2024-12-19 01:32:22', '2024-12-19 01:32:44', NULL),
(8, 3, 'auth_token', NULL, '3886d42897cbd7480716a6fe2aabcbc7a68e2ec8f631d44a993b99a6789f4363', '[\"*\"]', '2024-12-19 01:39:05', '2024-12-19 01:39:05', '2024-12-19 01:40:43', NULL),
(9, 3, 'auth_token', NULL, '246252f4792b40935e11a43b4ee78aafe0d12f2f0cb3e2743292a02e02d76fb5', '[\"*\"]', '2024-12-19 01:46:55', '2024-12-19 01:46:55', '2024-12-19 01:49:54', NULL),
(10, 5, 'auth_token', NULL, '9fde960099734b559e460b847c3ea504bfaf49d36a3173ab5b0cf351eaed2554', '[\"*\"]', '2024-12-19 01:50:27', '2024-12-19 01:50:27', '2024-12-19 01:50:30', NULL),
(11, 5, 'auth_token', NULL, 'f1636226cd6d09455b85501a47693729138122aacb09fcf6fed24c4154e7650d', '[\"*\"]', '2024-12-19 01:55:03', '2024-12-19 01:55:03', '2024-12-19 01:55:05', NULL),
(12, 5, 'auth_token', NULL, '6870037acdadf29d86615d1c30a4a1d53c0fad43bf6dfa3e90fdb345fefd74c1', '[\"*\"]', '2024-12-19 02:00:26', '2024-12-19 02:00:26', '2024-12-19 02:05:50', NULL),
(13, 5, 'auth_token', NULL, '5be72f2e09a651402c1274fb7c2714289daa7c3553c4a5e85bc092e458261187', '[\"*\"]', '2024-12-19 02:00:26', '2024-12-19 02:00:26', '2024-12-19 02:06:07', NULL),
(14, 5, 'auth_token', NULL, 'd37f29a8fa8bddefbc74088a4e66bf9047dc5877db6530094ae88763dfbcdda4', '[\"*\"]', '2024-12-19 02:03:32', '2024-12-19 02:03:32', '2024-12-19 02:12:16', NULL),
(15, 5, 'auth_token', NULL, 'd91a955465eb6e47bd6f501897c333b6672203dc84eea89e8b5cbd14aecfd7e8', '[\"*\"]', '2024-12-19 02:06:19', '2024-12-19 02:06:19', '2024-12-19 02:06:24', NULL),
(16, 3, 'auth_token', NULL, '96d41968e56e15083f5b58d753683e9e1861e82192bdaedef514e0af2c6acb1b', '[\"*\"]', '2024-12-19 02:06:30', '2024-12-19 02:06:30', '2024-12-19 02:06:55', NULL),
(17, 5, 'auth_token', NULL, '56c3702c6ab6ab5bbc563545a87ccd0f6ae9fdf679a383a4f367b052aeeb1e68', '[\"*\"]', '2024-12-19 02:21:31', '2024-12-19 02:21:31', '2024-12-19 02:21:39', NULL),
(18, 5, 'auth_token', NULL, 'b852c9d175845102865471291d875a1564089335ce27ac5ead372b5297a87dc2', '[\"*\"]', '2024-12-19 02:23:09', '2024-12-19 02:23:09', '2024-12-20 03:21:38', NULL),
(19, 5, 'auth_token', NULL, 'c39d4ad91e0d2ba58f6888d28bcf4efa55449f5570d55f0abbae196758733ba3', '[\"*\"]', '2024-12-19 02:47:12', '2024-12-19 02:47:12', '2024-12-19 03:01:02', NULL),
(20, 5, 'auth_token', NULL, '6b857b694afd0a55be7b2f47906de98e234153848e1e31d8132a8cf6de8ee399', '[\"*\"]', '2024-12-21 00:09:17', '2024-12-21 00:09:17', '2024-12-21 00:17:35', NULL),
(21, 5, 'auth_token', NULL, '132ade8fde9f1ea40953435703bbbee84b39ecf5e9cb210f10f124660f2114ec', '[\"*\"]', '2024-12-21 00:09:17', '2024-12-21 00:09:17', '2024-12-21 00:17:36', NULL),
(22, 5, 'auth_token', NULL, '5f614ffdbdcd036d7cc99b64c5e9b5cdabeeda19dc92f892baceb9a60032a013', '[\"*\"]', '2024-12-21 00:11:07', '2024-12-21 00:11:07', '2024-12-21 00:11:18', NULL),
(23, 5, 'auth_token', NULL, '460631e6e8026b91057ff4ad2d7bf07c78d0ce049543037f10a768709c95abdc', '[\"*\"]', '2025-01-04 02:01:59', '2025-01-04 02:01:59', '2025-01-04 02:51:43', NULL),
(24, 5, 'auth_token', NULL, 'b37939b3a39ff8c275f019080d5875d832ea81692080378931873d13139cfd88', '[\"*\"]', '2025-01-04 02:52:30', '2025-01-04 02:52:30', '2025-01-04 02:55:02', NULL),
(25, 5, 'auth_token', NULL, 'e15836416e0706d60379ee88028947bb5adc90ad672417d395fd18a4515888ed', '[\"*\"]', '2025-01-04 02:56:57', '2025-01-04 02:56:57', '2025-01-04 03:53:09', NULL),
(26, 5, 'auth_token', NULL, '906320e3b25b02a24fee5cacd6b6f9c7746d4d0f3cd80e398920f052a943f3a5', '[\"*\"]', '2025-01-04 03:45:47', '2025-01-04 03:45:47', '2025-01-04 19:13:54', NULL),
(27, 5, 'auth_token', NULL, '2bfa43c6cad3ca2869d5eedc4148cad83d91d403e7b0adfe69f4fc9b62535a5b', '[\"*\"]', '2025-01-04 21:24:56', '2025-01-04 21:24:56', '2025-01-04 21:34:27', NULL),
(28, 5, 'auth_token', NULL, '0d5d1356443e8055397902d9c7ba3a4c8803ff7351d9029bc9777a194cd64cfb', '[\"*\"]', '2025-01-08 22:26:08', '2025-01-08 22:26:08', '2025-01-08 22:26:10', NULL),
(29, 5, 'auth_token', NULL, '4c6cbd0634016f51e6ca2adb90f8867c50dc4624e8cdb9e633d241648e5d66f6', '[\"*\"]', '2025-01-08 22:26:09', '2025-01-08 22:26:09', '2025-01-08 22:26:51', NULL),
(30, 5, 'auth_token', NULL, 'b7917b2bc976eecf3e21c839a8aa22f951fe3fe5f8e83b7ae3654cf3cf825f65', '[\"*\"]', '2025-01-08 22:48:02', '2025-01-08 22:48:02', '2025-01-08 22:55:17', NULL),
(31, 5, 'auth_token', NULL, '56d0459088f8406c17ed8fe6d21c6cadd3aa0eb07485c90add5e33e45a96f131', '[\"*\"]', '2025-01-09 00:45:59', '2025-01-09 00:45:59', '2025-01-09 00:46:03', NULL),
(32, 5, 'auth_token', NULL, 'da174c59910b6de079469ec18d7a7876a0b3aa7df58cfb4b4fd90d0c7d9459d3', '[\"*\"]', '2025-01-28 02:54:29', '2025-01-28 02:54:29', '2025-01-28 02:54:35', NULL),
(33, 3, 'auth_token', NULL, '6f7ea4260107fb5ca188f33e59adb82242b66d2085629ea088b2071b9b78e032', '[\"*\"]', '2025-01-28 02:54:43', '2025-01-28 02:54:43', '2025-01-28 03:12:38', NULL),
(34, 3, 'auth_token', NULL, '61940cedbf2d4cc10cbe1311d73270fe1a2b6da672797bb1fc8315bd7cd231a1', '[\"*\"]', '2025-01-28 03:38:15', '2025-01-28 03:38:15', '2025-01-28 03:38:16', NULL),
(35, 3, 'auth_token', NULL, '38b4f635cdef131b5cb6391fb861ee45e6045ea361f959711a137c1edf3233a0', '[\"*\"]', '2025-01-28 03:48:09', '2025-01-28 03:48:09', '2025-01-28 03:48:10', NULL),
(36, 3, 'auth_token', NULL, 'a026338ee355406dc13738822cf3e856eb7e7aa3b86593b088d289d638bd81e0', '[\"*\"]', '2025-01-28 09:13:44', '2025-01-28 09:13:44', '2025-01-28 19:38:24', NULL),
(37, 3, 'auth_token', NULL, 'd379d0dcf105bb51a4a7d0219585d9761f77c17210e5fbdc34c35cd70d33e4f8', '[\"*\"]', '2025-01-29 13:50:52', '2025-01-29 13:50:52', '2025-01-29 13:50:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `whatsapp` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `cv_path` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `company_id` int UNSIGNED DEFAULT NULL,
  `reference1_company` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference1_position` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference1_name` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference1_timeworked` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference1_whatsapp` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference2_company` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference2_position` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference2_name` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference2_timeworked` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `reference2_whatsapp` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `comments` text COLLATE utf8mb3_unicode_ci,
  `status` enum('To Review','Start Exam','Exam Completed','Approved','Discarded') COLLATE utf8mb3_unicode_ci DEFAULT 'To Review',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `phone_contact` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `email`, `logo`, `website`, `phone_contact`, `user_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'La llorona Cantina', 'lalloronacantina@gmail.com', NULL, 'lalloronacantina.com', '529876787656', 5, 3, '2024-12-19 01:49:53', '2024-12-19 01:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `data_temp_tiktok_ads`
--

CREATE TABLE `data_temp_tiktok_ads` (
  `id` int NOT NULL,
  `company_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `name_campaign` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status_active` tinyint(1) NOT NULL,
  `status_run` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `conversions` float NOT NULL,
  `impressions` int NOT NULL,
  `clicks` int NOT NULL,
  `results` int NOT NULL,
  `costo` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_temp_tiktok_ads`
--

INSERT INTO `data_temp_tiktok_ads` (`id`, `company_id`, `user_id`, `name_campaign`, `start_date`, `end_date`, `status_active`, `status_run`, `conversions`, `impressions`, `clicks`, `results`, `costo`) VALUES
(1, 1, 5, 'pruebatiktok1', '2023-06-05 19:03:34', '2025-06-24 19:03:34', 1, 'finalizado', 0, 29471, 435, 435, 200),
(2, 1, 5, 'salsa1', '2023-08-15 19:03:34', '2025-08-17 19:03:34', 1, 'finalizado', 0, 0, 0, 0, 0),
(3, 1, 5, 'cumple2', '2023-08-29 19:03:34', '2025-09-02 19:03:34', 1, 'finalizado', 235, 28529, 361, 235, 324.94),
(4, 1, 5, 'cumple4', '2023-08-31 19:03:34', '2025-09-02 19:03:34', 1, 'finalizado', 0, 16574, 199, 199, 75.06),
(5, 1, 5, 'cumple4', '2023-12-05 19:03:34', '2025-12-08 19:03:34', 1, 'finalizado', 36, 16335, 73, 36, 75.06);

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `version` int DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `name`, `description`, `active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Marketing', 'Con técnicas avanzadas de SEO y estrategias de marketing digital, optimizamos tu presencia en línea para que tu restaurante aparezca en los primeros lugares de Google, Tik Tok, Facebook e Instagram.', 1, 3, '2024-12-19 03:09:29', '2024-12-19 03:09:29'),
(2, 'Sitio Web', 'Diseñamos tu web y sistema de reservas para llenar tu restaurante', 1, 3, '2024-12-19 03:10:36', '2024-12-19 03:10:36'),
(3, 'Punto de Venta', 'Te damos un punto de venta para que puedas agilizar tu operación con soporte 24/7', 1, 3, '2024-12-19 03:10:54', '2024-12-19 03:10:54'),
(4, 'RRHH', 'Te ofrecemos manuales y un departamento de recursos humanos con inteligencia artificial, así como manejo de despidos.', 1, 3, '2024-12-19 03:12:12', '2024-12-19 03:12:12'),
(5, 'Fidelización', 'Creamos programas de lealtad innovadores utilizando a través de una tarjeta de recompensas', 1, 3, '2024-12-19 03:12:49', '2024-12-19 03:12:49'),
(6, 'Asesoría', 'Te ayudamos a mantener todos los permisos y requisitos legales de tu restaurante siempre al día, asegurando que cumplas con todas las normativas vigentes de manera eficiente y sin preocupaciones.', 1, 3, '2024-12-19 03:13:45', '2024-12-19 03:13:45'),
(7, 'Financiamiento', 'Financiamiento para compra de equipo y crecimiento.', 1, 3, '2024-12-19 03:14:07', '2024-12-19 03:14:07'),
(8, 'Encuestas de servicio', 'Encuestas de servicio en tiempo Real', 1, 3, '2024-12-19 03:14:35', '2024-12-19 03:14:35'),
(9, 'Inventario', 'Control preciso y procesos optimizados para reducir costos y aumentar ganancias', 1, 3, '2024-12-19 03:15:13', '2024-12-19 03:15:13'),
(10, 'Monitoreo', 'Medimos la productividad de las personas con monitoreo 24/7, así como datos de los clientes que te visitan.', 1, 3, '2024-12-19 03:17:51', '2024-12-19 03:17:51');

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int UNSIGNED NOT NULL,
  `question_id` int UNSIGNED DEFAULT NULL,
  `text` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`id`, `question_id`, `text`, `created_at`, `updated_at`) VALUES
(1, 1, 'Planeación', '2025-01-27 22:02:04', NULL),
(2, 1, 'Operación', '2025-01-27 22:02:04', NULL),
(3, 2, 'Cafetería', '2025-01-27 22:02:04', NULL),
(4, 2, 'Bar', '2025-01-27 22:02:04', NULL),
(5, 2, 'Restaurante', '2025-01-27 22:02:04', NULL),
(6, 2, 'Cantina', '2025-01-27 22:02:04', NULL),
(7, 2, 'Food Truck', '2025-01-27 22:02:04', NULL),
(8, 2, 'Establecimiento de Coctelería de Autor', '2025-01-27 22:02:04', NULL),
(9, 2, 'Panadería', '2025-01-27 22:02:04', NULL),
(10, 3, '5 a 10%', '2025-01-27 22:02:04', NULL),
(11, 3, 'Nada', '2025-01-27 22:02:04', NULL),
(12, 3, '10% a 20%', '2025-01-27 22:02:04', NULL),
(13, 3, 'Más del 20%', '2025-01-27 22:02:04', NULL),
(14, 4, 'Oficinistas', '2025-01-27 22:02:04', NULL),
(15, 4, 'Familias', '2025-01-27 22:02:04', NULL),
(16, 4, 'Extranjeros', '2025-01-27 22:02:04', NULL),
(17, 4, 'Jóvenes', '2025-01-27 22:02:04', NULL),
(18, 4, 'Turistas', '2025-01-27 22:02:04', NULL),
(19, 4, 'Adultos mayores', '2025-01-27 22:02:04', NULL),
(20, 5, '50 a 200 por persona', '2025-01-27 22:02:04', NULL),
(21, 5, '200 a 500 por persona', '2025-01-27 22:02:04', NULL),
(22, 5, '500 a 1500 por persona', '2025-01-27 22:02:04', NULL),
(23, 5, 'Más de 1500 por persona', '2025-01-27 22:02:04', NULL),
(24, 5, 'No sé', '2025-01-27 22:02:04', NULL),
(25, 6, 'Amplio conocimiento de cocina', '2025-01-27 22:02:04', NULL),
(26, 6, 'Amplio conocimiento de barra', '2025-01-27 22:02:04', NULL),
(27, 6, 'Amplio conocimiento de servicio', '2025-01-27 22:02:04', NULL),
(28, 6, 'Amplio conocimiento de cocina, barra y servicio', '2025-01-27 22:02:04', NULL),
(29, 6, 'Poca experiencia', '2025-01-27 22:02:04', NULL),
(30, 7, '$100,000 a $500,000', '2025-01-27 22:02:04', NULL),
(31, 7, '$500,000 a $2,000,000', '2025-01-27 22:02:04', NULL),
(32, 7, '$2,000,000 a $8,000,000', '2025-01-27 22:02:04', NULL),
(33, 7, 'Más de $8,000,000', '2025-01-27 22:02:04', NULL),
(34, 8, 'Ninguna experiencia', '2025-01-27 22:02:04', NULL),
(35, 8, 'Experiencia moderada', '2025-01-27 22:02:04', NULL),
(36, 8, 'Amplia experiencia', '2025-01-27 22:02:04', NULL),
(37, 9, 'Cafetería', '2025-01-27 22:02:04', NULL),
(38, 9, 'Bar', '2025-01-27 22:02:04', NULL),
(39, 9, 'Restaurante', '2025-01-27 22:02:04', NULL),
(40, 9, 'Cantina', '2025-01-27 22:02:04', NULL),
(41, 9, 'Food Truck', '2025-01-27 22:02:04', NULL),
(42, 9, 'Establecimiento de Coctelería de Autor', '2025-01-27 22:02:04', NULL),
(43, 9, 'Panadería', '2025-01-27 22:02:04', NULL),
(44, 10, 'Oficinistas', '2025-01-27 22:02:04', NULL),
(45, 10, 'Familias', '2025-01-27 22:02:04', NULL),
(46, 10, 'Jóvenes', '2025-01-27 22:02:04', NULL),
(47, 10, 'Extranjeros', '2025-01-27 22:02:04', NULL),
(48, 10, 'Turistas', '2025-01-27 22:02:04', NULL),
(49, 10, 'Adultos mayores', '2025-01-27 22:02:04', NULL),
(50, 11, '$100,000 a $500,000', '2025-01-27 22:02:04', NULL),
(51, 11, '$500,000 a $2,000,000', '2025-01-27 22:02:04', NULL),
(52, 11, '$2,000,000 a $8,000,000', '2025-01-27 22:02:04', NULL),
(53, 11, 'Más de $8,000,000', '2025-01-27 22:02:04', NULL),
(54, 12, 'Muy claro, tengo una idea definida.', '2025-01-27 22:02:04', NULL),
(55, 12, 'Medianamente claro, necesito ayuda para refinarlo.', '2025-01-27 22:02:04', NULL),
(56, 12, 'No tengo claro el concepto, necesito orientación.', '2025-01-27 22:02:04', NULL),
(57, 13, 'Menos de $200', '2025-01-27 22:02:04', NULL),
(58, 13, '$200 a $500', '2025-01-27 22:02:04', NULL),
(59, 13, '$500 a $1,500', '2025-01-27 22:02:04', NULL),
(60, 13, 'Más de $1,500', '2025-01-27 22:02:04', NULL),
(61, 14, 'Ninguna experiencia', '2025-01-27 22:02:04', NULL),
(62, 14, 'Experiencia moderada', '2025-01-27 22:02:04', NULL),
(63, 14, 'Amplia experiencia', '2025-01-27 22:02:04', NULL),
(64, 15, 'Definir el concepto', '2025-01-27 22:02:04', NULL),
(65, 15, 'Crear un plan de negocio', '2025-01-27 22:02:04', NULL),
(66, 15, 'Elegir la ubicación correcta', '2025-01-27 22:02:04', NULL),
(67, 15, 'Crear una estrategia de marketing', '2025-01-27 22:02:04', NULL),
(68, 15, 'Manejar los costos y presupuestos', '2025-01-27 22:02:04', NULL),
(69, 15, 'Conseguir los permisos necesarios', '2025-01-27 22:02:04', NULL),
(70, 15, 'Capacitar al personal', '2025-01-27 22:02:04', NULL),
(71, 16, 'Muy importante, quiero destacar con algo único.', '2025-01-27 22:02:04', NULL),
(72, 16, 'Medianamente importante, quiero algo competitivo pero no necesariamente único.', '2025-01-27 22:02:04', NULL),
(73, 16, 'No es mi prioridad, quiero algo funcional.', '2025-01-27 22:02:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `description`, `price`, `active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Plan básico', NULL, 25000.00, 1, 3, '2024-12-18 20:47:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plans_modules`
--

CREATE TABLE `plans_modules` (
  `id` int UNSIGNED NOT NULL,
  `plan_id` int UNSIGNED DEFAULT NULL,
  `module_id` int UNSIGNED DEFAULT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `plans_modules`
--

INSERT INTO `plans_modules` (`id`, `plan_id`, `module_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 3, '2024-12-19 01:32:36', '2024-12-19 01:32:36'),
(2, 1, 1, 3, '2024-12-19 01:32:36', '2024-12-19 01:32:36'),
(3, 1, 4, 3, '2024-12-19 01:32:36', '2024-12-19 01:32:36'),
(4, 1, 3, 3, '2024-12-19 02:06:55', '2024-12-19 02:06:55'),
(5, 1, 7, 3, '2024-12-19 02:06:55', '2024-12-19 02:06:55'),
(6, 1, 6, 3, '2024-12-19 02:06:55', '2024-12-19 02:06:55'),
(7, 1, 5, 3, '2024-12-19 02:06:55', '2024-12-19 02:06:55'),
(8, 1, 8, 3, '2024-12-19 02:06:55', '2024-12-19 02:06:55'),
(9, 1, 9, 3, '2024-12-19 02:06:55', '2024-12-19 02:06:55'),
(10, 1, 10, 3, '2024-12-19 02:06:56', '2024-12-19 02:06:56');

-- --------------------------------------------------------

--
-- Table structure for table `prospects`
--

CREATE TABLE `prospects` (
  `id` int UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `origin` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `whatsapp` varchar(15) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `prospects`
--

INSERT INTO `prospects` (`id`, `first_name`, `last_name`, `email`, `origin`, `status`, `whatsapp`, `created_at`, `updated_at`) VALUES
(1, 'Jampier real prueba', 'vasquez', 'jampierv127@gmail.com', 'inteligenciaArtificial', 'creado', '9876789878', '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(2, 'Jose prueba real', 'vasquez', 'jampierv127@gmail.com', 'inteligenciaArtificial', 'creado', '9098767876', '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(3, 'Jose prueba real', 'vasquez', 'jampierv127@gmail.com', 'inteligenciaArtificial', 'creado', '9098767876', '2025-01-28 03:37:29', '2025-01-28 03:37:29'),
(4, 'hector prueba 27-11', 'velaquez', 'hectoremilio1000@gmail.com', 'pdfBanner', 'creado', '5521293811', '2025-01-28 10:16:57', '2025-01-28 10:16:57'),
(5, 'hectorpueba2', 'velasquez', 'hectoremilio1000@gmail.com', 'pdfBanner', 'creado', '5521293811', '2025-01-28 10:30:34', '2025-01-28 10:30:34'),
(6, 'juan', 'diario', 'hectoremilio1000@gmail.com', 'pdfBanner', 'creado', '5521293811', '2025-01-28 10:41:01', '2025-01-28 10:41:01'),
(7, 'juan meeting', 'velasquez', 'hectoremilio1000@gmail.com', 'citaenvivo', 'creado', '5521293811', '2025-01-28 10:43:21', '2025-01-28 10:43:21'),
(8, 'hect', 'ppp', 'hectoremilio1000@gmail.com', 'CasosExitoModaldemogratis', 'creado', '5521293811', '2025-01-28 11:02:55', '2025-01-28 11:02:55'),
(9, 'hector prueba video', 'hectore', 'hectoremilio1000@gmail.com', 'PruebaGratisFormulariodemogratis', 'creado', '5521293811', '2025-01-28 11:10:14', '2025-01-28 11:10:14'),
(10, 'Hector yaaaaaa', 'Velasquez', 'hectoremilio1000@gmail.com', 'PruebaGratisFormulariodemogratis', 'creado', '5521293811', '2025-01-28 11:17:00', '2025-01-28 11:17:00');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int UNSIGNED NOT NULL,
  `statement` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `context` enum('planeacion','operando','general') COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `statement`, `context`, `created_at`, `updated_at`) VALUES
(1, '¿Ya abriste tu negocio o estás en planeación?', 'general', '2025-01-27 22:01:53', NULL),
(2, '¿Qué tipo de establecimiento tienes?', 'operando', '2025-01-27 22:01:53', NULL),
(3, '¿Cuánto es lo que te queda de lo que vendes después de gastos?', 'operando', '2025-01-27 22:01:53', NULL),
(4, '¿Cuál es el tipo de público que frecuenta más este tipo de negocio?', 'operando', '2025-01-27 22:01:53', NULL),
(5, '¿Ticket promedio actual o el que buscas?', 'operando', '2025-01-27 22:01:53', NULL),
(6, '¿Qué sabes del sector gastronómico?', 'operando', '2025-01-27 22:01:53', NULL),
(7, 'Tamaño de la inversión realizada o por realizar', 'operando', '2025-01-27 22:01:53', NULL),
(8, '¿Cuál es tu experiencia previa en la industria de restaurantes?', 'operando', '2025-01-27 22:01:53', NULL),
(9, '¿Qué tipo de negocio planeas abrir?', 'planeacion', '2025-01-27 22:01:53', NULL),
(10, '¿Quién será tu público objetivo principal? escoge 2', 'planeacion', '2025-01-27 22:01:53', NULL),
(11, '¿Cuál es el tamaño de la inversión inicial que planeas hacer?', 'planeacion', '2025-01-27 22:01:53', NULL),
(12, '¿Qué tan claro tienes el concepto de tu negocio?', 'planeacion', '2025-01-27 22:01:53', NULL),
(13, '¿Cuál será el ticket promedio por cliente?', 'planeacion', '2025-01-27 22:01:53', NULL),
(14, '¿Qué nivel de experiencia tienes en la industria de restaurantes o negocios en general?', 'planeacion', '2025-01-27 22:01:53', NULL),
(15, '¿Qué aspectos te preocupan más para iniciar tu negocio?', 'planeacion', '2025-01-27 22:01:53', NULL),
(16, '¿Qué tan importante será para tu negocio ofrecer un producto único y diferenciado?', 'planeacion', '2025-01-27 22:01:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questions_candidates`
--

CREATE TABLE `questions_candidates` (
  `id` int UNSIGNED NOT NULL,
  `exam_id` int UNSIGNED NOT NULL,
  `text` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `question_weight` decimal(3,2) NOT NULL DEFAULT '1.00',
  `option_a` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `weight_a` decimal(3,2) NOT NULL DEFAULT '0.00',
  `option_b` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `weight_b` decimal(3,2) NOT NULL DEFAULT '0.00',
  `option_c` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `weight_c` decimal(3,2) NOT NULL DEFAULT '0.00',
  `option_d` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `weight_d` decimal(3,2) NOT NULL DEFAULT '0.00',
  `option_e` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `weight_e` decimal(3,2) NOT NULL DEFAULT '0.00',
  `correct_answer` varchar(1) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `id` int UNSIGNED NOT NULL,
  `text` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `prospect_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `recommendations`
--

INSERT INTO `recommendations` (`id`, `text`, `user_id`, `prospect_id`, `created_at`, `updated_at`) VALUES
(1, '¡Hola! A continuación, te presento las recomendaciones personalizadas para impulsar tu negocio gastronómico basadas en las respuestas que has proporcionado:\n\n### 1. Inspiración Visionaria:\n- Considerando tu tipo de establecimiento y el público que frecuen', NULL, 1, '2025-01-28 03:12:26', '2025-01-28 03:12:26'),
(2, '¡Hola Jose!\n\n### Inspiración Visionaria:\n1. **Tipo de Establecimiento:** Según tu respuesta, creo que podrías inspirarte en Danny Meyer, quien es conocido por su enfoque en la hospitalidad y la excelencia en el servicio. Considera cómo podrías implementar', NULL, 2, '2025-01-28 03:24:12', '2025-01-28 03:24:12'),
(3, '### Inspiración Visionaria:\n\n#### Ejemplo de Inspiración - **Howard Schultz**:\nCon base en tu experiencia previa en la industria restaurantera y en el tipo de público que frecuenta más tu negocio, podemos tomar inspiración de Howard Schultz, el visionario', NULL, 3, '2025-01-28 03:37:38', '2025-01-28 03:37:38');

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `prospect_id` int UNSIGNED DEFAULT NULL,
  `option_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `responses`
--

INSERT INTO `responses` (`id`, `user_id`, `prospect_id`, `option_id`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, 7, '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(2, NULL, 1, 10, '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(3, NULL, 1, 16, '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(4, NULL, 1, 20, '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(5, NULL, 1, 27, '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(6, NULL, 1, 30, '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(7, NULL, 1, 35, '2025-01-28 03:12:20', '2025-01-28 03:12:20'),
(8, NULL, 2, 7, '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(9, NULL, 2, 13, '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(10, NULL, 2, 17, '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(11, NULL, 2, 20, '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(12, NULL, 2, 26, '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(13, NULL, 2, 30, '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(14, NULL, 2, 35, '2025-01-28 03:24:05', '2025-01-28 03:24:05'),
(15, NULL, 3, 7, '2025-01-28 03:37:30', '2025-01-28 03:37:30'),
(16, NULL, 3, 13, '2025-01-28 03:37:30', '2025-01-28 03:37:30'),
(17, NULL, 3, 17, '2025-01-28 03:37:30', '2025-01-28 03:37:30'),
(18, NULL, 3, 20, '2025-01-28 03:37:30', '2025-01-28 03:37:30'),
(19, NULL, 3, 26, '2025-01-28 03:37:30', '2025-01-28 03:37:30'),
(20, NULL, 3, 30, '2025-01-28 03:37:30', '2025-01-28 03:37:30'),
(21, NULL, 3, 35, '2025-01-28 03:37:30', '2025-01-28 03:37:30');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', '2024-12-16 05:20:30', '2024-12-16 05:20:30'),
(2, 'admin', '2024-12-16 05:20:35', '2024-12-16 05:20:35');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `active_title` tinyint(1) NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `active_description` tinyint(1) NOT NULL,
  `image` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `active_image` tinyint(1) NOT NULL,
  `successcase_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sedes`
--

CREATE TABLE `sedes` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `map_url` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `company_id` int UNSIGNED DEFAULT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sedes`
--

INSERT INTO `sedes` (`id`, `name`, `location`, `map_url`, `company_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Ofic. Central CDMX', 'Alvaro Obrego Cdmx', '-', 1, 3, '2024-12-19 01:49:53', '2024-12-19 01:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `plan_id` int UNSIGNED DEFAULT NULL,
  `is_payment` tinyint(1) NOT NULL DEFAULT '0',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('active','expired','cancelled') COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan_id`, `is_payment`, `start_date`, `end_date`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 5, 1, 0, '2024-12-18 00:00:00', '2024-12-31 00:00:00', 'active', 3, '2024-12-19 01:49:54', '2024-12-19 01:49:54');

-- --------------------------------------------------------

--
-- Table structure for table `successcases`
--

CREATE TABLE `successcases` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transacctions`
--

CREATE TABLE `transacctions` (
  `id` int UNSIGNED NOT NULL,
  `subscription_id` int UNSIGNED DEFAULT NULL,
  `method_payment` enum('cash','mercado_pago','bank_trans','credit_card','debit_card','paypal','stripe','cryptocurrency','check','mobile_payment') COLLATE utf8mb3_unicode_ci NOT NULL,
  `status` enum('pending','completed','failed') COLLATE utf8mb3_unicode_ci NOT NULL,
  `transaction_number` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `rol_id` int UNSIGNED DEFAULT NULL,
  `created_by` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `created_at`, `updated_at`, `rol_id`, `created_by`) VALUES
(3, 'Hector Emilio', 'hector2@gmail.com', '2024-12-16 05:20:40', '$scrypt$n=16384,r=8,p=1$Zvt6wSZw4p3EW8nBEPj42Q$6HtqUq9b9Z5kjZjkvRXuomB3z1835sA+MXp+QTO1MntXVculJQyfBnQqjpwa65r204Kcst0nudfC/zQA05N8WA', '2024-12-16 05:20:40', '2024-12-16 05:20:40', 1, NULL),
(5, 'Hector', 'hectoremilio1000@gmail.com', '2024-12-19 01:49:52', '$scrypt$n=16384,r=8,p=1$GqZ6oFHva7WRRb+YFzr2bQ$4enXAIPKr2cZSm+/xnLSMCL4XIjpYXDg8GJUaR6tKo8himNBLXPyUDI1tLvUblkGH3mzvXwGK0m0zHmRyYIUjw', '2024-12-19 01:49:52', '2024-12-19 01:49:52', 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_calendlies`
--

CREATE TABLE `users_calendlies` (
  `id` int UNSIGNED NOT NULL,
  `calendly_uid` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `access_token` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `refresh_token` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_sedes`
--

CREATE TABLE `users_sedes` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `sede_id` int UNSIGNED DEFAULT NULL,
  `created_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adonis_schema_versions`
--
ALTER TABLE `adonis_schema_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indexes for table `answer_candidates`
--
ALTER TABLE `answer_candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `answer_candidates_candidate_id_foreign` (`candidate_id`),
  ADD KEY `answer_candidates_question_id_foreign` (`question_id`),
  ADD KEY `answer_candidates_exam_id_foreign` (`exam_id`);

--
-- Indexes for table `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auth_access_tokens_tokenable_id_foreign` (`tokenable_id`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidates_company_id_foreign` (`company_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `companies_user_id_foreign` (`user_id`),
  ADD KEY `companies_created_by_foreign` (`created_by`);

--
-- Indexes for table `data_temp_tiktok_ads`
--
ALTER TABLE `data_temp_tiktok_ads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`name_campaign`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `modules_created_by_foreign` (`created_by`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `options_question_id_foreign` (`question_id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plans_created_by_foreign` (`created_by`);

--
-- Indexes for table `plans_modules`
--
ALTER TABLE `plans_modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plans_modules_plan_id_foreign` (`plan_id`),
  ADD KEY `plans_modules_module_id_foreign` (`module_id`),
  ADD KEY `plans_modules_created_by_foreign` (`created_by`);

--
-- Indexes for table `prospects`
--
ALTER TABLE `prospects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions_candidates`
--
ALTER TABLE `questions_candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questions_candidates_exam_id_foreign` (`exam_id`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recommendations_user_id_foreign` (`user_id`),
  ADD KEY `recommendations_prospect_id_foreign` (`prospect_id`);

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responses_user_id_foreign` (`user_id`),
  ADD KEY `responses_prospect_id_foreign` (`prospect_id`),
  ADD KEY `responses_option_id_foreign` (`option_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sections_successcase_id_foreign` (`successcase_id`);

--
-- Indexes for table `sedes`
--
ALTER TABLE `sedes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sedes_company_id_foreign` (`company_id`),
  ADD KEY `sedes_created_by_foreign` (`created_by`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscriptions_user_id_foreign` (`user_id`),
  ADD KEY `subscriptions_plan_id_foreign` (`plan_id`),
  ADD KEY `subscriptions_created_by_foreign` (`created_by`);

--
-- Indexes for table `successcases`
--
ALTER TABLE `successcases`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transacctions`
--
ALTER TABLE `transacctions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transacctions_subscription_id_foreign` (`subscription_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_rol_id_foreign` (`rol_id`),
  ADD KEY `users_created_by_foreign` (`created_by`);

--
-- Indexes for table `users_calendlies`
--
ALTER TABLE `users_calendlies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_calendlies_calendly_uid_unique` (`calendly_uid`),
  ADD KEY `users_calendlies_user_id_foreign` (`user_id`);

--
-- Indexes for table `users_sedes`
--
ALTER TABLE `users_sedes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_sedes_user_id_foreign` (`user_id`),
  ADD KEY `users_sedes_sede_id_foreign` (`sede_id`),
  ADD KEY `users_sedes_created_by_foreign` (`created_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adonis_schema`
--
ALTER TABLE `adonis_schema`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `answer_candidates`
--
ALTER TABLE `answer_candidates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `data_temp_tiktok_ads`
--
ALTER TABLE `data_temp_tiktok_ads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `plans_modules`
--
ALTER TABLE `plans_modules`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `prospects`
--
ALTER TABLE `prospects`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `questions_candidates`
--
ALTER TABLE `questions_candidates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `responses`
--
ALTER TABLE `responses`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sedes`
--
ALTER TABLE `sedes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `successcases`
--
ALTER TABLE `successcases`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transacctions`
--
ALTER TABLE `transacctions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users_calendlies`
--
ALTER TABLE `users_calendlies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_sedes`
--
ALTER TABLE `users_sedes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer_candidates`
--
ALTER TABLE `answer_candidates`
  ADD CONSTRAINT `answer_candidates_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answer_candidates_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answer_candidates_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions_candidates` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_access_tokens`
--
ALTER TABLE `auth_access_tokens`
  ADD CONSTRAINT `auth_access_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `companies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `data_temp_tiktok_ads`
--
ALTER TABLE `data_temp_tiktok_ads`
  ADD CONSTRAINT `data_temp_tiktok_ads_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `data_temp_tiktok_ads_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `plans_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `plans_modules`
--
ALTER TABLE `plans_modules`
  ADD CONSTRAINT `plans_modules_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `plans_modules_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`),
  ADD CONSTRAINT `plans_modules_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`);

--
-- Constraints for table `questions_candidates`
--
ALTER TABLE `questions_candidates`
  ADD CONSTRAINT `questions_candidates_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `recommendations_prospect_id_foreign` FOREIGN KEY (`prospect_id`) REFERENCES `prospects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recommendations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `responses_option_id_foreign` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `responses_prospect_id_foreign` FOREIGN KEY (`prospect_id`) REFERENCES `prospects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `responses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_successcase_id_foreign` FOREIGN KEY (`successcase_id`) REFERENCES `successcases` (`id`);

--
-- Constraints for table `sedes`
--
ALTER TABLE `sedes`
  ADD CONSTRAINT `sedes_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `sedes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`),
  ADD CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `transacctions`
--
ALTER TABLE `transacctions`
  ADD CONSTRAINT `transacctions_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `users_calendlies`
--
ALTER TABLE `users_calendlies`
  ADD CONSTRAINT `users_calendlies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_sedes`
--
ALTER TABLE `users_sedes`
  ADD CONSTRAINT `users_sedes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_sedes_sede_id_foreign` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`),
  ADD CONSTRAINT `users_sedes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
