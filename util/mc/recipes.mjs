
function getRecipesFromFiles(files){
    const recipes = {};
    for (const path in files) {
        if (files.hasOwnProperty(path) && path.includes("/recipes/") && path.endsWith(".json")) {
            const json = JSON.parse(files[path].toString());
            const result = json.result?.item || json.result || json.outputItem || json.item;
            if(!result){
                continue;
            }
            if(recipes[result]?.length > 0){
                recipes[result].push(json);
            } else {
                recipes[result] = [json];
            }
        }
    }
    return recipes;
}

export {
    getRecipesFromFiles
}
