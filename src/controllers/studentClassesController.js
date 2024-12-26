const StudentClass = require('../models/student_classes'); // Import model StudentClass
const Student = require('../models/Students'); // Import model Student
const Kehadiran = require('../models/Kehadiran'); // Import model Kehadiran
const Kelas = require('../models/Kelas'); // Import model Kelas
const { getPagination, getPagingData } = require('../utils/paginationHelper'); // Helper untuk paginasi


// Create a new student-class association
const createStudentClass = async (req, res) => {
    const { student_id, kelas_id } = req.body;

    try {
        // Check if the student exists
        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the class exists
        const kelas = await Kelas.findByPk(kelas_id);
        if (!kelas) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Create student-class association
        const newStudentClass = await StudentClass.create({ student_id, kelas_id });

        return res.status(201).json({
            message: 'Student assigned to class successfully',
            data: newStudentClass,
        });
    } catch (error) {
        console.error('Error creating student-class association:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all students in a class
const getStudentsByClass = async (req, res) => {
    const { kelas_id } = req.params;
    const { page = 1, size = 10 } = req.query; // Default page dan size
    const { limit, offset } = getPagination(page, size);

    try {
        const studentsInClass = await StudentClass.findAndCountAll({
            where: { kelas_id },
            limit, // Batas data per halaman
            offset, // Posisi awal data
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: [
                        'id',
                        'nama_lengkap',
                        'nis',
                        'jenis_kelamin',
                        'tempat_lahir',
                        'tanggal_lahir',
                    ], 
                    
                },
                {
                    model: Kehadiran, // Model Kehadiran
                    as: 'kehadiran', // Alias sesuai dengan relasi di model
                    attributes: ['status', 'tanggal', 'keterangan'], // Kolom yang diambil
                },
            ],
        });

        if (studentsInClass.rows.length === 0) {
            return res.status(404).json({ message: 'No students found in this class' });
        }

        const response = getPagingData(
            studentsInClass,
            page,
            limit,
            `/api/student-classes/${kelas_id}` // URL dasar untuk navigasi pagination
        );

        return res.status(200).json({
            message: 'Students in class retrieved successfully',
            ...response, // Gabungkan hasil paginasi dengan data
        });
    } catch (error) {
        console.error('Error fetching students by class:', error);
        res.status(500).json({ error: error.message });
    }
};


// Remove a student from a class
const removeStudentFromClass = async (req, res) => {
    const { id } = req.params;

    try {
        const studentClass = await StudentClass.findByPk(id);
        if (!studentClass) {
            return res.status(404).json({ message: 'Student-class association not found' });
        }

        await studentClass.destroy();

        return res.status(200).json({ message: 'Student removed from class successfully' });
    } catch (error) {
        console.error('Error removing student from class:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update student-class association (e.g., change class)
const updateStudentClass = async (req, res) => {
    const { id } = req.params;
    const { kelas_id } = req.body;

    try {
        const studentClass = await StudentClass.findByPk(id);
        if (!studentClass) {
            return res.status(404).json({ message: 'Student-class association not found' });
        }

        const updatedStudentClass = await studentClass.update({ kelas_id });

        return res.status(200).json({
            message: 'Student-class association updated successfully',
            data: updatedStudentClass,
        });
    } catch (error) {
        console.error('Error updating student-class association:', error);
        res.status(500).json({ error: error.message });
    }
};

const bulkCreateStudentInClass = async (req, res) => {
    const { kelas_id, students } = req.body;

    if (!kelas_id) {
        return res.status(400).json({ message: 'kelas_id is required' });
    }

    if (!students || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ message: 'Students data is required and should be an array' });
    }

    try {
        const successfulInsertions = [];
        const failedInsertions = [];

        // Loop through students to find their IDs
        for (const student of students) {
            const { nama_lengkap, nis } = student;

            try {
                // Find student by name and NIS
                const foundStudent = await Student.findOne({
                    where: { nama_lengkap, nis },
                    attributes: ['id'], // Only fetch the student ID
                });

                if (!foundStudent) {
                    failedInsertions.push({
                        student,
                        reason: `Data Siswa Tidak Ditemukan. Untuk bagian Nama ${nama_lengkap},dan NIS: ${nis}`,
                    });
                    continue; // Skip to the next student
                }

                // Create student-class association
                const newStudentClass = await StudentClass.create({
                    student_id: foundStudent.id,
                    kelas_id,
                });

                successfulInsertions.push({
                    student: {
                        nama_lengkap,
                        nis,
                    },
                    data: newStudentClass,
                });
            } catch (error) {
                console.error(`Error processing student: ${nama_lengkap}, NIS: ${nis}`, error);
                failedInsertions.push({
                    student,
                    reason: `Error processing student: ${error.message}`,
                });
            }
        }

        // Return response with both successful and failed results
        return res.status(201).json({
            message: 'Bulk student-class association process completed',
            successCount: successfulInsertions.length,
            failedCount: failedInsertions.length,
            successfulInsertions,
            failedInsertions,
        });
    } catch (error) {
        console.error('Error in bulk creating student-class association:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createStudentClass,
    getStudentsByClass,
    removeStudentFromClass,
    updateStudentClass,
    bulkCreateStudentInClass
};
