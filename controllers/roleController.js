const Role = require('../models/Role');
const RoleMenu = require('../models/RoleMenus');
const { getPagination, getPagingData, buildConditions } = require('../utils/paginationHelper');

exports.createRole = async (req, res) => {
    try {
        const { rolename, desc, status } = req.body;
        const role = await Role.create({ rolename, desc, status });
        res.status(201).send(role);
    } catch (error) {
        res.status(500).send({ message: "Error creating role: " + error.message });
    }
};
exports.getAllRoles = async (req, res) => {
    try {
        const { paging, page, size, startDate, endDate, term } = req.body;
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?').shift()}`;

        const conditions = buildConditions({ startDate, endDate, term });

        if (paging) {
            const { limit, offset } = getPagination(page, size);
            const result = await Role.findAndCountAll({
                where: conditions,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
            const response = getPagingData(result, page, limit, baseUrl);
            res.status(200).json({
                status: "success",
                code: 200,
                message: "Roles retrieved successfully",
                data: response
            });
        } else {
            const roles = await Role.findAll({
                where: conditions,
                order: [['created_at', 'DESC']]
            });
            res.status(200).json({
                status: "success",
                code: 200,
                message: "Roles retrieved successfully",
                data: {
                    items: roles,
                    pagination: {
                        totalItems: roles.length,
                        currentPage: 1,
                        perPage: roles.length,
                        totalPages: 1,
                        urls: {
                            current: `${baseUrl}?page=1`
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error retrieving roles:", error);
        res.status(500).json({
            status: "error",
            code: 500,
            message: error.message || "Some error occurred while retrieving roles."
        });
    }
};


exports.createRoleMenu = async (req, res) => {
    try {
        const { role_id, parent_id, child_id, status, created_at, updated_at } = req.body;
        const roleMenuEntry = await RoleMenu.create({
            role_id,
            menu_id: child_id,
            parent_id,
            status,
            created_at,
            updated_at
        });

        res.status(201).json({ message: "Role-Menu relationship added successfully", data: roleMenuEntry });
    } catch (error) {
        console.error("Error adding Role-Menu entry:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRoleMenus = async (req, res) => {
    try {
        const roleMenus = await RoleMenu.findAll();
        res.status(200).json(roleMenus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
