const { remote } = require("electron");
const { Menu, MenuItem } = remote;

window._MenuItem = MenuItem;
window._contextMenu = new Menu();
window._remote = remote;

require("./preload.js")