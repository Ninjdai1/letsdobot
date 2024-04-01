
function getTexturesFromFiles(files){
    const textures = {};
    for (const path in files) {
        if (files.hasOwnProperty(path) && path.includes("/textures/") && (path.includes("/item/") || path.includes("/block/")) && path.endsWith(".png")) {
            const modname = path.split("/")[1];
            const itemname = path.split("/")[4].replace(".png", "");
            const itemid = `${modname}:${itemname}`;
            if(!textures[itemid]){
                textures[itemid] = path;
            }
        }
    }
    return textures;
}

export {
    getTexturesFromFiles
}
