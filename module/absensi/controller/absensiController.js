const jwt = require("jsonwebtoken");
const Teachers = require("../model/Teachers");
const JadwalPelajaran = require("../model/JadwalPelajaran");
const Kelas = require("../model/Kelas");
const MataPelajaran = require("../model/MataPelajaran");
const SemesterTahunAjaran = require("../model/SemesterTahunAjaran");
const Students = require("../model/Student");
const StudentClasses = require("../model/StudentClases");
const Kehadiran = require("../model/Kehadiran");

const SECRET_KEY = process.env.SECRET_KEY;

exports.mapel = async (req, res) => {
  try {
    const token = req.headers["login"];
    if (!token) {
      return res.status(401).json({ message: "Login token is required" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const teacher = await Teachers.findOne({ where: { user_id: userId } });
    if (!teacher) {
      return res
        .status(403)
        .json({ message: "Access denied: User is not a teacher" });
    }

    const jadwalPelajaran = await JadwalPelajaran.findAll({
      where: { teacher_id: teacher.id },
    });
    if (!jadwalPelajaran || jadwalPelajaran.length === 0) {
      return res.status(404).json({ message: "No schedules found" });
    }

    const result = await Promise.all(
      jadwalPelajaran.map(async (jadwal) => {
        const kelas = await Kelas.findOne({ where: { id: jadwal.kelas_id } });

        const mataPelajaran = await MataPelajaran.findOne({
          where: { id: jadwal.mata_pelajaran_id },
        });

        const semesterTahunAjaran = await SemesterTahunAjaran.findOne({
          where: { id: jadwal.semester_tahun_ajaran_id },
        });

        return {
          jadwal_id: jadwal.id,
          hari: jadwal.hari,
          jam_mulai: jadwal.jam_mulai,
          jam_selesai: jadwal.jam_selesai,
          kelas: kelas
            ? { id: kelas.id, nama: kelas.nama_kelas, tingkat: kelas.tingkat }
            : null,
          mata_pelajaran: mataPelajaran
            ? {
                id: mataPelajaran.id,
                nama: mataPelajaran.nama_pelajaran,
                kode: mataPelajaran.kode_pelajaran,
              }
            : null,
          guru: {
            id: teacher.id,
            nama: teacher.nama_lengkap,
            nip: teacher.nip,
          },
          semester_tahun_ajaran: semesterTahunAjaran
            ? {
                id: semesterTahunAjaran.id,
                tahun_ajaran: semesterTahunAjaran.tahun_ajaran,
                semester: semesterTahunAjaran.semester,
              }
            : null,
        };
      })
    );

    res
      .status(200)
      .json({ message: "Schedules fetched successfully", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch schedules", error: error.message });
  }
};

exports.getAbsensiData = async (req, res) => {
    try {
        const token = req.headers["login"];
        if (!token) {
            return res.status(401).json({ message: "Login token is required" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const kelas_id = parseInt(req.params.kelas_id, 10);
        const mata_pelajaran_id = parseInt(req.params.mata_pelajaran_id, 10);

        if (!kelas_id || !mata_pelajaran_id) {
            return res.status(400).json({ message: "Kelas ID dan Mata Pelajaran ID diperlukan" });
        }

        console.log("Decoded Token:", decoded);
        console.log("Kelas ID:", kelas_id);
        console.log("Mata Pelajaran ID:", mata_pelajaran_id);

        const jadwal = await JadwalPelajaran.findOne({ where: { kelas_id, mata_pelajaran_id } });
        console.log("Jadwal:", jadwal);

        if (!jadwal) {
            return res.status(404).json({ message: "Jadwal tidak ditemukan" });
        }

        const studentClasses = await StudentClasses.findAll({ where: { kelas_id } });

        if (!studentClasses || studentClasses.length === 0) {
            return res.status(404).json({ message: "Tidak ada murid di kelas ini" });
        }

        const studentIds = studentClasses.map((sc) => sc.student_id);

        const students = await Students.findAll({ where: { id: studentIds } });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "Tidak ada murid yang ditemukan" });
        }

        const absensiData = students.map((student) => ({
            student_id: student.id,
            nama: student.nama_lengkap,
            nis: student.nis,
            kelas: kelas_id,
            mata_pelajaran: mata_pelajaran_id,
        }));

        res.status(200).json({
            message: "Data absensi berhasil diambil",
            data: absensiData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data absensi",
            error: error.message,
        });
    }
};


exports.AbsensiStudent = async (req, res) => {
    try {
        const { tanggal, status, keterangan } = req.body;
        const { student_id, kelas_id, semester_tahun_ajaran_id } = req.params;

        if (!student_id || !kelas_id || !semester_tahun_ajaran_id || !tanggal || !status) {
            return res.status(400).json({ message: "Semua data absensi diperlukan" });
        }

        const studentClass = await StudentClasses.findOne({ where: { student_id, kelas_id } });
        if (!studentClass) {
            return res.status(404).json({ message: "Student tidak ditemukan di kelas ini" });
        }

        const semester = await SemesterTahunAjaran.findOne({ where: { id: semester_tahun_ajaran_id } });
        if (!semester) {
            return res.status(404).json({ message: "Semester tahun ajaran tidak ditemukan" });
        }

        const newAbsensi = await Kehadiran.create({
            student_id: parseInt(student_id, 10),
            kelas_id: parseInt(kelas_id, 10),
            semester_tahun_ajaran_id: parseInt(semester_tahun_ajaran_id, 10),
            tanggal,
            status,
            keterangan: keterangan || null,
        });

        res.status(201).json({
            message: "Data absensi berhasil ditambahkan",
            data: newAbsensi,
        });
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan saat menambahkan data absensi",
            error: error.message,
        });
    }
};
