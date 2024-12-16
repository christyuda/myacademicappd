// const Menu = require('./Menu');
// const RoleMenu = require('./RoleMenus');
// const Role = require('./Role');

// // Definisikan relasi di sini
// Menu.hasMany(RoleMenu, {
//     foreignKey: 'menu_id',
//     as: 'roleMenus', // Alias unik
// });

// RoleMenu.belongsTo(Menu, {
//     foreignKey: 'menu_id',
//     as: 'menuDetail', // Alias unik
// });

// Role.hasMany(RoleMenu, {
//     foreignKey: 'role_id',
//     as: 'roleMenus', // Alias unik
// });

// RoleMenu.belongsTo(Role, {
//     foreignKey: 'role_id',
//     as: 'roleDetail', // Alias unik
// });

// module.exports = {
//     Menu,
//     RoleMenu,
//     Role,
// };
