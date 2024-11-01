const { QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class IdGeneratorService {
    static async getNextId(paramName) {
        const result = await sequelize.query('CALL generateID(:paramName)', {
            replacements: { paramName },
            type: QueryTypes.RAW
        });
        return result[0];
    }
}

module.exports = IdGeneratorService;