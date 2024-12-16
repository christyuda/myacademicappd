const Menu = require('../models/Menu');
const RoleMenu = require('../models/RoleMenus');
const { getPagination, getPagingData } = require('../utils/paginationHelper');

exports.addMenuToRole = async (req, res) => {
    const { role_id, menu_id, parent_id } = req.body;
    try {
        // Menyimpan data langsung ke tabel rolemenus
        const roleMenuEntry = await RoleMenu.create({
            role_id: role_id,
            menu_id: menu_id,
            parent_id: parent_id || 0, // Nilai parent_id bisa null jika tidak ada
            status: 1,                    // Default status
            created_at: new Date(),       // Set created_at otomatis
            updated_at: new Date()        // Set updated_at otomatis
        });
        
        res.status(201).json({ message: 'Menu added to role successfully', data: roleMenuEntry });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};


// Mengambil semua menu untuk role
exports.getMenusForRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const role = await Role.findByPk(roleId, {
            include: 'menus'
        });
        if (role) {
            res.status(200).json(role.menus);
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createParentMenu = async (req, res) => {
    try {
        const { menu_id, nama_menu, routes_page, icon, sequence } = req.body;
        const newMenu = await Menu.create({
            menu_id,
            parent_id: 0, // Default parent_id untuk parent menu
            nama_menu,
            routes_page,
            icon,
            sequence,
            status: 1 // Asumsi status aktif
        });
        res.status(201).json(newMenu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createChildMenu = async (req, res) => {
    try {
        const { menu_id, nama_menu, routes_page, icon } = req.body;
        const parentMenuId = req.body.parent_id;  
        const parentMenu = await Menu.findOne({
            where: { menu_id: parentMenuId }
        });

        if (!parentMenu) {
            return res.status(404).json({ message: "Parent menu not found" });
        }

        const existingChildrenCount = await Menu.count({
            where: { parent_id: parentMenu.menu_id }
        });

        const newSequence = existingChildrenCount + 1;

        const newMenu = await Menu.create({
            menu_id,
            parent_id: parentMenu.menu_id, 
            nama_menu,
            routes_page,
            icon,
            sequence: newSequence,  
            status: 1 
        });

        res.status(201).json(newMenu);
    } catch (error) {
        console.error("Error creating child menu:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllMenusWithParent = async (req, res) => {
    try {
        const { role_id, page = 1, limit = 10 } = req.body;

        if (!role_id) {
            return res.status(400).json({
                status: 'error',
                message: 'role_id is required'
            });
        }

        // Menggunakan helper untuk mendapatkan limit dan offset
        const { limit: paginationLimit, offset } = getPagination(page, limit);

        // Ambil data rolemenus berdasarkan role_id
        const roleMenus = await RoleMenu.findAll({
            where: { role_id },
            attributes: ['menu_id'] // Ambil hanya menu_id yang terhubung dengan role_id
        });

        if (!roleMenus.length) {
            return res.status(404).json({
                status: 'error',
                message: 'No menus found for this role_id'
            });
        }

        // Ambil menu berdasarkan menu_id yang didapat dari rolemenus
        const menuIds = roleMenus.map(rm => rm.menu_id); // Mengambil menu_id dari rolemenus
        const menus = await Menu.findAndCountAll({
            where: {
                menu_id: menuIds
            },
            attributes: ['menu_id', 'parent_id', 'nama_menu', 'routes_page', 'icon', 'sequence'],
            order: [['sequence', 'ASC']], // Urutkan berdasarkan sequence
            limit: paginationLimit,
            offset: offset,
        });

        // Strukturkan data menjadi parent-child
        const structuredMenus = menus.rows.reduce((acc, menu) => {
            if (!menu.parent_id) {
                acc[menu.menu_id] = {
                    ...menu.dataValues,
                    children: [],
                };
            } else {
                const parentMenu = acc[menu.parent_id];
                if (parentMenu) {
                    parentMenu.children.push(menu.dataValues);
                }
            }
            return acc;
        }, {});

        const result = Object.values(structuredMenus);

        // Gunakan helper untuk menambahkan data pagination

        // Return response yang lebih terstruktur sesuai keinginan
        return res.status(200).json({
            status: 'success',
            message: 'Menus fetched successfully',
            data: result, // Hanya data menu dengan struktur parent-child
            // pagination // Mengirim pagination dalam format yang benar
        });
    } catch (error) {
        console.error('Error fetching menus with parents:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};