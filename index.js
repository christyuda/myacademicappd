const express = require('express');
const fs = require('fs');
const path = require('path');
const { sequelize, connectMySQL } = require('./config/dbConfig');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const roleRoutes = require('./routes/roleRoutes');
const menuRoutes = require('./routes/menuRoutes');
const roleMenus = require('./routes/roleMenuRoutes');
const setupSwagger = require('./swagger/swaggerSetup');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app, 'role/role.yaml');

app.use('/api', roleRoutes);
app.use('/api', menuRoutes);
app.use('/api', roleMenus);


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
