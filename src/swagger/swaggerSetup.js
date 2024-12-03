const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

// Function to dynamically load the Swagger document
function loadSwaggerDocument(docPath) {
    try {
        return YAML.load(path.join(__dirname, 'docs', docPath));
    } catch (error) {
        console.error('Failed to load the Swagger document:', error);
        return null; // Return null or a default Swagger object to prevent the app from crashing
    }
}

// Setup function to be exported
function setupSwagger(app, docPath) {
    const swaggerDocument = loadSwaggerDocument(docPath);
    if (!swaggerDocument) {
        console.error('Swagger document is not available.');
        return;
    }

    const customCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'custom.css'), 'utf8');
    const customJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'custom.js'), 'utf8');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss,
        customJs
    }));
}

module.exports = setupSwagger;
