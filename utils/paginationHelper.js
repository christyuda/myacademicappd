// utils/paginationHelper.js
const { Op } = require('sequelize');

// utils/paginationHelper.js

const getPagination = (page, size) => {
    const limit = size ? +size : 10; // default to 10 items per page
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};
const getPagingData = (data, page, limit, baseUrl) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    // Define navigation links
    const pagination = {
        totalItems,
        currentPage,
        perPage: limit,
        totalPages,
        urls: {
            current: `${baseUrl}?page=${currentPage}`,
            prev: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
            next: currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : null
        }
    };

    return {
        items: rows,
        pagination
    };
};

const buildConditions = ({ startDate, endDate, term }) => {
    const conditions = {};
    if (term) {
        conditions[Op.or] = [
            { rolename: { [Op.like]: `%${term}%` } },
            { desc: { [Op.like]: `%${term}%` } }
        ];
    }
    if (startDate) {
        conditions.created_at = { ...conditions.created_at, [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
        conditions.created_at = { ...conditions.created_at, [Op.lte]: new Date(endDate) };
    }
    return conditions;
};

module.exports = { getPagination, getPagingData, buildConditions };
