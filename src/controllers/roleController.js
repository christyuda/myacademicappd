const Role = require('../models/Role');
const RoleMenu = require('../models/RoleMenus');
const { getPagination, getPagingData, buildConditions } = require('../utils/paginationHelper');
const Menu = require('../models/Menu');
exports.createRole = async (req, res) => {
    try {
        const { rolename, desc, status } = req.body;
        if (!rolename || !desc || !status) {
            return res.status(400).json({ 
                message: "All fields (rolename, desc, status) are required."
            });
        }
        // Validasi status (konversi ke "0" atau "1")
        const parsedStatus = status === "1" ? "1" : "0";

        // Ambil role_id terbesar
        const maxRole = await Role.findOne({
            attributes: ['role_id'],
            order: [['role_id', 'DESC']],
        });

        const nextRoleId = maxRole ? (parseInt(maxRole.role_id, 10) + 1).toString() : "1";

        // Simpan ke database
        const role = await Role.create({
            role_id: nextRoleId,
            rolename,
            desc,
            status: parsedStatus,
        });

        res.status(201).json({
            message: "Role created successfully",
            data: role
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error("Error creating role:", error);
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
        const { page, size } = req.query; // Ambil parameter page dan size dari query
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;

        // Ambil paginasi (limit dan offset)
        const { limit, offset } = getPagination(page, size);

        // Query data dengan paginasi
        const roleMenus = await RoleMenu.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']], // Optional: urutkan berdasarkan waktu dibuat
        });

        // Format respons dengan paginasi
        const response = getPagingData(roleMenus, page, limit, baseUrl);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching role menus:", error.message);
        res.status(500).json({ message: "Error fetching role menus: " + error.message });
    }
};

exports.getRoleMenuData = async (req, res) => {
    try {
        const { page, size } = req.query; // Ambil parameter page dan size dari query
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;

        // Ambil paginasi (limit dan offset)
        const { limit, offset } = getPagination(page, size);

        // Query data dari RoleMenu
        const roleMenus = await RoleMenu.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']], // Urutkan berdasarkan waktu dibuat
        });

        // Ambil role_name berdasarkan role_id dari tabel roles
        const formattedData = await Promise.all(roleMenus.rows.map(async (roleMenu) => {
            const role = await Role.findOne({
                where: { role_id: roleMenu.role_id },
                attributes: ['rolename']
            });

            const roleName = role ? role.rolename : 'Unknown Role';

            const menu = await Menu.findOne({
                where: { menu_id: roleMenu.menu_id },
                attributes: ['nama_menu', 'parent_id']
            });

            let parentMenuName = 'No Parent';
            if (menu && menu.parent_id === 0) {
                parentMenuName = menu.nama_menu; // Menu Parent
            }

            // Jika ada parent_id yang tidak sama dengan 0, cari submenu
            let subMenuName = '';
            if (menu && menu.parent_id !== 0) {
                const parentMenu = await Menu.findOne({
                    where: { menu_id: menu.parent_id }
                });
                subMenuName = parentMenu ? parentMenu.nama_menu : '';
            }

            return {
                ...roleMenu.dataValues,
                role_name: roleName,
                menu_name: menu ? menu.nama_menu : 'Unknown Menu',
                parent_name: parentMenuName,
                sub_menu_name: subMenuName
            };
        }));

        // Format respons dengan paginasi
        const response = getPagingData({ count: roleMenus.count, rows: formattedData }, page, limit, baseUrl);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching role menu data:", error.message);
        res.status(500).json({ message: "Error fetching role menu data: " + error.message });
    }
};