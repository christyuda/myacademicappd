const Menu = require('../models/Menu');
const Role = require('../models/Role');

exports.addMenuToRole = async (req, res) => {
    const { roleId, menuId } = req.body;
    try {
        const role = await Role.findByPk(roleId);
        const menu = await Menu.findByPk(menuId);
        if (role && menu) {
            await role.addMenu(menu);
            res.status(200).json({ message: 'Menu added to role successfully' });
        } else {
            res.status(404).json({ message: 'Role or Menu not found' });
        }
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
