
function getTagsFromFiles(files){
    const tags = {};
    for (const path in files) {
        if (files.hasOwnProperty(path) && path.includes("/tags/") && (path.includes("/items/") || path.includes("/blocks/")) && path.endsWith(".json")) {
            const modname = path.split("/")[1];
            const json = JSON.parse(files[path].toString());
            const tagname = path.split("/")[4].replace(".json", "");
            if(tags[`${modname}:${tagname}`]){
                tags[`${modname}:${tagname}`].values?.push(...json.values)
            } else {
                tags[`${modname}:${tagname}`] = json;
            }
        }
    }
    return tags;
}

export {
    getTagsFromFiles
}
