-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_sikad_mysql
CREATE DATABASE IF NOT EXISTS `db_sikad_mysql` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_sikad_mysql`;

-- Dumping structure for table db_sikad_mysql.admin_keuangan
CREATE TABLE IF NOT EXISTS `admin_keuangan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_admin_id` int NOT NULL,
  `finance_area` varchar(100) NOT NULL,
  `budget_limit` decimal(15,2) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `alamat` text,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_keuangan_admin` (`user_admin_id`),
  CONSTRAINT `fk_keuangan_admin` FOREIGN KEY (`user_admin_id`) REFERENCES `users_admin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.admin_keuangan: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.admin_keuangan_siswa
CREATE TABLE IF NOT EXISTS `admin_keuangan_siswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_admin_id` int NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `alamat` text,
  `payment_area` varchar(100) NOT NULL,
  `permissions` text NOT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_keuangan_siswa_admin` (`user_admin_id`),
  CONSTRAINT `fk_keuangan_siswa_admin` FOREIGN KEY (`user_admin_id`) REFERENCES `users_admin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.admin_keuangan_siswa: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.admin_landing_pages
CREATE TABLE IF NOT EXISTS `admin_landing_pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_admin_id` int NOT NULL,
  `page_name` varchar(100) NOT NULL,
  `permissions` text NOT NULL,
  `description` text,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `nama_lengkap` varchar(100) NOT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `alamat` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_landing_pages_admin` (`user_admin_id`),
  CONSTRAINT `fk_landing_pages_admin` FOREIGN KEY (`user_admin_id`) REFERENCES `users_admin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.admin_landing_pages: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.jadwal_pelajaran
CREATE TABLE IF NOT EXISTS `jadwal_pelajaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kelas_id` int NOT NULL,
  `mata_pelajaran_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `semester_tahun_ajaran_id` int NOT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_jadwal_kelas` (`kelas_id`),
  KEY `fk_jadwal_mata_pelajaran` (`mata_pelajaran_id`),
  KEY `fk_jadwal_teacher` (`teacher_id`),
  KEY `fk_jadwal_semester_tahun_ajaran` (`semester_tahun_ajaran_id`),
  CONSTRAINT `fk_jadwal_kelas` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jadwal_mata_pelajaran` FOREIGN KEY (`mata_pelajaran_id`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jadwal_semester_tahun_ajaran` FOREIGN KEY (`semester_tahun_ajaran_id`) REFERENCES `semester_tahun_ajaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jadwal_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.jadwal_pelajaran: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.kehadiran
CREATE TABLE IF NOT EXISTS `kehadiran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `semester_tahun_ajaran_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `status` enum('Hadir','Izin','Sakit','Alpa') NOT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_kehadiran_student` (`student_id`),
  KEY `fk_kehadiran_semester_tahun_ajaran` (`semester_tahun_ajaran_id`),
  CONSTRAINT `fk_kehadiran_semester_tahun_ajaran` FOREIGN KEY (`semester_tahun_ajaran_id`) REFERENCES `semester_tahun_ajaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_kehadiran_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.kehadiran: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.kelas
CREATE TABLE IF NOT EXISTS `kelas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int DEFAULT NULL,
  `nama_kelas` varchar(50) NOT NULL,
  `tingkat` int NOT NULL,
  `kapasitas` int NOT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_kelas_wali_kelas` (`teacher_id`),
  CONSTRAINT `fk_kelas_wali_kelas` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.kelas: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.mata_pelajaran
CREATE TABLE IF NOT EXISTS `mata_pelajaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_pelajaran` varchar(100) NOT NULL,
  `kode_pelajaran` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_pelajaran` (`kode_pelajaran`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.mata_pelajaran: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.menus
CREATE TABLE IF NOT EXISTS `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  `nama_menu` varchar(255) NOT NULL,
  `routes_page` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `sequence` int NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `parent_sequence` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.menus: ~1 rows (approximately)
REPLACE INTO `menus` (`id`, `menu_id`, `parent_id`, `nama_menu`, `routes_page`, `icon`, `sequence`, `status`, `parent_sequence`, `created_at`, `updated_at`) VALUES
	(19, 1, 0, 'Dashboard', '/dashboard', 'dashboard-icon', 1, 1, NULL, '2024-11-09 19:54:01', '2024-11-09 19:54:01'),
	(20, 2, 1, 'Reports', '/dashboard/reports', 'reports-icon', 1, 1, NULL, '2024-11-09 19:55:27', '2024-11-09 19:55:27');

-- Dumping structure for table db_sikad_mysql.nilai
CREATE TABLE IF NOT EXISTS `nilai` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `wali_kelas_id` int NOT NULL,
  `mata_pelajaran_id` int NOT NULL,
  `semester_tahun_ajaran_id` int NOT NULL,
  `nilai_absen` decimal(5,2) DEFAULT '0.00',
  `nilai_tugas` decimal(5,2) DEFAULT '0.00',
  `nilai_ujian` decimal(5,2) DEFAULT '0.00',
  `nilai_akhir` decimal(5,2) DEFAULT '0.00',
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_nilai_student` (`student_id`),
  KEY `fk_nilai_wali_kelas` (`wali_kelas_id`),
  KEY `fk_nilai_mata_pelajaran` (`mata_pelajaran_id`),
  KEY `fk_nilai_semester_tahun_ajaran` (`semester_tahun_ajaran_id`),
  CONSTRAINT `fk_nilai_mata_pelajaran` FOREIGN KEY (`mata_pelajaran_id`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_nilai_semester_tahun_ajaran` FOREIGN KEY (`semester_tahun_ajaran_id`) REFERENCES `semester_tahun_ajaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_nilai_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_nilai_wali_kelas` FOREIGN KEY (`wali_kelas_id`) REFERENCES `wali_kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.nilai: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.principals
CREATE TABLE IF NOT EXISTS `principals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `nip` varchar(20) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `agama` varchar(20) DEFAULT NULL,
  `alamat` text,
  `no_telepon` varchar(15) DEFAULT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `status` enum('Aktif','Nonaktif','Pensiun') DEFAULT 'Aktif',
  `catatan_khusus` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`),
  KEY `fk_principals_users` (`user_id`),
  CONSTRAINT `fk_principals_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.principals: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.rolemenus
CREATE TABLE IF NOT EXISTS `rolemenus` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.rolemenus: ~2 rows (approximately)
REPLACE INTO `rolemenus` (`id`, `role_id`, `menu_id`, `parent_id`, `status`, `created_at`, `updated_at`) VALUES
	(1, 1, 2, NULL, 1, '2024-11-09 20:08:52', '2024-11-09 20:08:52'),
	(2, 1, 2, 2, 1, '2024-11-09 20:10:03', '2024-11-09 20:10:03');

-- Dumping structure for table db_sikad_mysql.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rolename` varchar(255) NOT NULL,
  `desc` text,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.roles: ~3 rows (approximately)
REPLACE INTO `roles` (`id`, `rolename`, `desc`, `status`, `created_at`, `updated_at`) VALUES
	(2, 'admin', 'ini merupakan admin', 1, '2024-11-01 16:17:41', '2024-11-01 16:17:41'),
	(3, 'guru', 'ini merupakan guru', 1, '2024-11-01 16:38:52', '2024-11-20 17:16:04'),
	(4, 'siswa', 'ini merupakan guru', 1, '2024-11-09 19:39:13', '2024-11-20 17:16:17'),
	(99, 'default', 'ini merupakan default', 1, '2024-11-01 16:17:41', '2024-11-01 16:17:41');

-- Dumping structure for table db_sikad_mysql.semester_tahun_ajaran
CREATE TABLE IF NOT EXISTS `semester_tahun_ajaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tahun_ajaran` varchar(20) NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.semester_tahun_ajaran: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.students
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nis` varchar(20) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `agama` varchar(20) DEFAULT NULL,
  `alamat` text,
  `no_telepon` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `status` enum('Aktif','Lulus','Pindah','Dropout') DEFAULT 'Aktif',
  `catatan_khusus` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nis` (`nis`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_students_users` (`user_id`),
  CONSTRAINT `fk_students_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.students: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.teachers
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nip` varchar(20) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `agama` varchar(20) DEFAULT NULL,
  `alamat` text,
  `no_telepon` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `status` enum('Aktif','Nonaktif','Pensiun') DEFAULT 'Aktif',
  `catatan_khusus` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_wali_kelas` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_teachers_users` (`user_id`),
  CONSTRAINT `fk_teachers_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.teachers: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `email` varchar(255) NOT NULL,
  `emailVerifiedAt` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rememberToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.users: ~1 rows (approximately)
REPLACE INTO `users` (`id`, `role_id`, `status`, `email`, `emailVerifiedAt`, `password`, `rememberToken`, `created_at`, `updated_at`) VALUES
	(1, 0, 1, 'john.doe@example.com', NULL, 'securepassword123', NULL, '2024-11-20 16:42:27', '2024-11-20 17:13:26');

-- Dumping structure for table db_sikad_mysql.users_admin
CREATE TABLE IF NOT EXISTS `users_admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `email` varchar(255) NOT NULL,
  `emailVerifiedAt` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rememberToken` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.users_admin: ~0 rows (approximately)

-- Dumping structure for table db_sikad_mysql.wali_kelas
CREATE TABLE IF NOT EXISTS `wali_kelas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `kelas_id` int NOT NULL,
  `tahun_ajaran` varchar(20) NOT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_wali_kelas_teacher` (`teacher_id`),
  KEY `fk_wali_kelas_kelas` (`kelas_id`),
  CONSTRAINT `fk_wali_kelas_kelas` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wali_kelas_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_sikad_mysql.wali_kelas: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
