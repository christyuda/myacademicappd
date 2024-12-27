const kehadiranModel = require('../models/Kehadiran');
const { getPagination, getPagingData } = require('../utils/paginationHelper');
const { sequelize } = require('../config/dbConfig');

// Create a new Kehadiran
const createKehadiran = async (req, res) => {
    const { student_id, jadwal_pelajaran_id, semester_tahun_ajaran_id, tanggal, status, keterangan } = req.body;

    try {
        // Buat entri Kehadiran baru
        const newKehadiran = await kehadiranModel.create({
            student_id,
            jadwal_pelajaran_id,
            semester_tahun_ajaran_id,
            tanggal,
            status,
            keterangan,
        });

        // Format respons sesuai permintaan
        return res.status(201).json({
            statusCode: 201,
            message: 'Kehadiran created successfully',
            data: {
                id: newKehadiran.id,
                student_id: newKehadiran.student_id,
                jadwal_pelajaran_id: newKehadiran.jadwal_pelajaran_id,
                semester_tahun_ajaran_id: newKehadiran.semester_tahun_ajaran_id,
                tanggal: newKehadiran.tanggal,
                status: newKehadiran.status,
                keterangan: newKehadiran.keterangan,
                created_at: newKehadiran.created_at,
                updated_at: newKehadiran.updated_at,
            },
        });
    } catch (error) {
        console.error('Error creating Kehadiran:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Get all Kehadiran with pagination
const getAllKehadiran = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    try {
        // Query manual untuk join data
        const query = `
            SELECT 
            k.id AS id,
            s.nama_lengkap AS nama_siswa,
            mp.nama_pelajaran AS nama_pelajaran, 
            kls.nama_kelas AS nama_kelas,
            CONCAT(sta.tahun_ajaran, ' - Semester ', sta.semester) AS nama_semester,
            jp.hari,
            jp.jam_mulai,
            jp.jam_selesai,
            k.tanggal,
            k.status,
            k.keterangan,
            k.created_at,
            k.updated_at
        FROM kehadiran k
        LEFT JOIN students s ON k.student_id = s.id -- Menghubungkan ke tabel students
        LEFT JOIN jadwal_pelajaran jp ON k.jadwal_pelajaran_id = jp.id -- Menghubungkan ke tabel jadwal_pelajaran
        LEFT JOIN kelas kls ON jp.kelas_id = kls.id -- Menghubungkan ke tabel kelas
        LEFT JOIN mata_pelajaran mp ON jp.mata_pelajaran_id = mp.id -- Menghubungkan ke tabel mata_pelajaran
        LEFT JOIN semester_tahun_ajaran sta ON jp.semester_tahun_ajaran_id = sta.id -- Menghubungkan ke tabel semester_tahun_ajaran
        ORDER BY k.created_at DESC
        LIMIT :limit OFFSET :offset;



        `;

        const data = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { limit, offset },
        });

        // Hitung total data
        const totalItems = await sequelize.query(
            `SELECT COUNT(*) AS count FROM kehadiran`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Format respons
        const response = {
            items: data,
            pagination: {
                totalItems: totalItems[0].count,
                currentPage: parseInt(page),
                perPage: parseInt(size),
                totalPages: Math.ceil(totalItems[0].count / size),
                urls: {
                    current: `/api/kehadiran?page=${page}&size=${size}`,
                    prev: page > 1 ? `/api/kehadiran?page=${page - 1}&size=${size}` : null,
                    next: page < Math.ceil(totalItems[0].count / size) ? `/api/kehadiran?page=${parseInt(page) + 1}&size=${size}` : null,
                },
            },
        };

        res.status(200).json({
            status: true,
            code: 'SUCCESS',
            message: 'Kehadiran fetched successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error fetching Kehadiran:', error);
        res.status(500).json({
            status: false,
            code: 'ERROR',
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get a single Kehadiran by ID
const getKehadiranById = async (req, res) => {
    const { id } = req.params;

    try {
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({ message: 'Kehadiran not found' });
        }

        res.status(200).json(kehadiran);
    } catch (error) {
        console.error('Error fetching Kehadiran:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update a Kehadiran
const updateKehadiran = async (req, res) => {
    const { id } = req.params;
    const { student_id, jadwal_pelajaran_id, semester_tahun_ajaran_id, tanggal, status, keterangan } = req.body;

    try {
        // Cari kehadiran berdasarkan ID
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Kehadiran not found',
                data: null,
            });
        }

        // Perbarui data kehadiran
        await kehadiran.update({
            student_id,
            jadwal_pelajaran_id,
            semester_tahun_ajaran_id,
            tanggal,
            status,
            keterangan,
        });

        // Format respons sukses
        return res.status(200).json({
            statusCode: 200,
            message: 'Kehadiran updated successfully',
            data: {
                id: kehadiran.id,
                student_id: kehadiran.student_id,
                jadwal_pelajaran_id: kehadiran.jadwal_pelajaran_id,
                semester_tahun_ajaran_id: kehadiran.semester_tahun_ajaran_id,
                tanggal: kehadiran.tanggal,
                status: kehadiran.status,
                keterangan: kehadiran.keterangan,
                created_at: kehadiran.created_at,
                updated_at: kehadiran.updated_at,
            },
        });
    } catch (error) {
        console.error('Error updating Kehadiran:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Delete a Kehadiran
const deleteKehadiran = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari kehadiran berdasarkan ID
        const kehadiran = await kehadiranModel.findByPk(id);

        if (!kehadiran) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Kehadiran not found',
                data: null,
            });
        }

        // Hapus data kehadiran
        await kehadiran.destroy();

        // Format respons sukses
        return res.status(200).json({
            statusCode: 200,
            message: 'Kehadiran deleted successfully',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting Kehadiran:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const createOrUpdateKehadiran = async (req, res) => {
    const { student_id, jadwal_pelajaran_id, semester_tahun_ajaran_id, tanggal, status, keterangan } = req.body;

    try {
        // Validasi apakah student_id ada di tabel students
        const studentExists = await sequelize.query(
            'SELECT id FROM students WHERE id = :student_id',
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { student_id },
            }
        );

        if (studentExists.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: `Student with id ${student_id} does not exist.`,
            });
        }

        // Periksa apakah data kehadiran sudah ada
        const existingKehadiran = await kehadiranModel.findOne({
            where: {
                student_id,
                jadwal_pelajaran_id,
                semester_tahun_ajaran_id,
                tanggal,
            },
        });

        if (existingKehadiran) {
            // Jika sudah ada, update data
            await existingKehadiran.update({
                status,
                keterangan,
            });

            return res.status(200).json({
                statusCode: 200,
                message: 'Kehadiran updated successfully',
                data: existingKehadiran,
            });
        } else {
            // Jika belum ada, buat data baru
            const newKehadiran = await kehadiranModel.create({
                student_id,
                jadwal_pelajaran_id,
                semester_tahun_ajaran_id,
                tanggal,
                status,
                keterangan,
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'Kehadiran created successfully',
                data: newKehadiran,
            });
        }
    } catch (error) {
        console.error('Error handling Kehadiran:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


module.exports = {
    createKehadiran,
    getAllKehadiran,
    getKehadiranById,
    updateKehadiran,
    deleteKehadiran,
    createOrUpdateKehadiran
};
