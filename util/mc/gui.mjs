import Canvas from "canvas";

async function generateRecipeImage(recipe){
    let canvas, ctx;
    const background = await Canvas.loadImage(`./assets/crafting_methods/${gui_types[recipe.type].gui}.png`);
    const keys = {};
    switch(recipe.type){
        case 'minecraft:crafting_shaped':
            canvas = Canvas.createCanvas(247, 139);
            ctx = canvas.getContext('2d');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            /*for (const key of Object.keys(recipe.key)) {
                keys[key] = itemOrTag(recipe.key[key]);
            }*/
            return {canvas: canvas, ctx: ctx};
            break;
        case 'minecraft:crafting_shapeless':
            canvas = Canvas.createCanvas(247, 139);
            ctx = canvas.getContext('2d');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            /*for (const key of Object.keys(recipe.ingredients)) {
                keys[key] = itemOrTag(recipe.ingredients[key]);
            }*/
            return {canvas: canvas, ctx: ctx};
            break;
    }
}

function itemOrTag(data){
    if(data?.tag) return `#${data.tag}`;
    else if(data?.item) return `${data.item}`;
    return "";
}

const gui_types = {
    "minecraft:crafting_shapeless": {
        gui: "crafting_table",
        pattern: false
    },
    "minecraft:crafting_shaped": {
        gui: "crafting_table",
        pattern: true
    }
}

export { generateRecipeImage }
