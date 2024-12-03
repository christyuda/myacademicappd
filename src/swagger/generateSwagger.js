// File: swagger/generateSwagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'This is a sample server',
        },
    },
    apis: ['../routes/*.js', '../models/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerYaml = YAML.stringify(swaggerSpec, 10);

fs.writeFileSync(path.join(__dirname, 'docs', 'apiDocs.yaml'), swaggerYaml);
console.log('Swagger YAML file has been generated!');
