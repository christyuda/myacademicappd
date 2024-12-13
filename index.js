const express = require('express');
const fs = require('fs');
const path = require('path');
const { sequelize, connectMySQL } = require('./src/config/dbConfig');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

const roleRoutes = require('./src/routes/roleRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const roleMenus = require('./src/routes/roleMenuRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/AuthRoutes');
const semeesterRoutes = require('./src/routes/SemesterRoutes');
const studentRoutes = require('./src/routes/StudentsRoutes');
const kehadiranRoutes = require('./src/routes/KehadiranRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const kelasRoutes = require('./src/routes/kelasRoutes');
const mataPelajaranRoutes = require('./src/routes/mapelRoutes');
const jadwalPelajaranRoutes = require('./src/routes/jadwalPelajaranRoutes');
const absensiRoutes = require('./module/absensi/routes/absensiRoutes');

const setupSwagger = require('./src/swagger/swaggerSetup');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app, 'role/role.yaml');

app.use('/api', roleRoutes);
app.use('/api', menuRoutes);
app.use('/api', roleMenus);
app.use('/api', userRoutes);
app.use('/api', semeesterRoutes);
app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', kelasRoutes);
app.use('/api', mataPelajaranRoutes);
app.use('/api', jadwalPelajaranRoutes);

app.use('/api', kehadiranRoutes);
app.use('/api', absensiRoutes);
app.use('/api/auth', authRoutes);


// Rute untuk mengirim HTML dari file terpisah
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'views', 'welcome.html');
    fs.readFile(htmlPath, 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, unable to load the welcome page.');
            return;
        }
        res.send(html);
    });
});

connectMySQL().then(db => {
    if (db) {
        app.listen(port, () => {
            console.log(`
            ################################################
            #                                              #
            #    🌟 Server is up and running! 🌟             #
            #    🚀 Visit: http://localhost:${port} 🚀       #
            #                                              #
            ################################################
            `);
        });
    } else {
        console.error('Unable to connect to the database. Server not started.');
    }
}).catch(err => {
    console.error('Startup error:', err);
});
