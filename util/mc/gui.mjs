import Canvas from "canvas";

async function generateRecipeImage(recipe){
    let canvas, ctx;
    const background = await Canvas.loadImage(`./assets/crafting_methods/${gui_types[recipe.type].gui}.png`);
    switch(recipe.type){
        case 'minecraft:crafting_shaped':
            canvas = Canvas.createCanvas(247, 139);
            ctx = canvas.getContext('2d');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/png');
            break;
    }
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
