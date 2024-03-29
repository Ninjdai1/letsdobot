import { ActionRowBuilder, AttachmentBuilder, ComponentType, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("recipe")
        .setDescription("Search the recipe for an item")
        .addStringOption(option => option
            .setName("item")
            .setDescription("The item to search for")
            .setAutocomplete(true)),
    async execute(interaction, client) {
        const item = interaction.options.getString("item");

        const modRecipes = global.modData.recipes[item];
        if(!modRecipes) return interaction.reply({ content: `Could not find any recipe for the item: \`${item}\`...`, ephemeral: true });
        const recipeEmbeds = [];
        const navigationSelectMenu = new StringSelectMenuBuilder().setCustomId("ignore").setPlaceholder("Other recipes");
        for (let index = 0; index<modRecipes.length; index++) {
            const recipe = modRecipes[index];
            await generateRecipeEmbed(recipe, item, 'en_us').then(embed => {
                recipeEmbeds.push(embed);
            })
            navigationSelectMenu.addOptions({
                label: recipe.type,
                value: String(index),
            });
        }

        const reply = await interaction.reply({
            embeds: [recipeEmbeds[0].embed],
            components: recipeEmbeds.length>1 ? [new ActionRowBuilder().setComponents(navigationSelectMenu)]:null,
            ephemeral: true
        });

        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 300_000 });
        collector.on('collect', async i => {
            await i.update({embeds: [recipeEmbeds[i.values[0]]]});
        });
    },
    async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const filtered = global.cache.recipesNames.filter(choice => choice.includes(focusedValue)).splice(0, 25);
		await interaction.respond(
			filtered.map(choice => ({ name: itemTranslation(choice, 'en_us'), value: choice })),
		);
	},
};

function itemTranslation(id, lang) {
    const modName = id.split(":")[0];
    const key = `${modName}.${id.split(":")[1]}`;
    //console.log(global.modData.langs[lang][`item.${key}`]);
    const translation = global.modData.langs[lang][`item.${key}`] || global.modData.langs[lang][`block.${key}`] || id;
    return `${translation} (${capitalizeFirstLetter(modName.replace("any #", ""))})`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function generateRecipeEmbed(recipe, item, lang){
    const recipeEmbed = new EmbedBuilder()
        .setTitle(itemTranslation(item, lang));
    let description;
    switch (recipe.type) {
        //Vanilla recipes:
        case "minecraft:crafting_shaped":
        case "minecraft:crafting_shapeless":
            description = `You can craft **${recipe?.result?.count || 1} ${itemTranslation(item, lang)}** in the following pattern:\n`
                + `${craftStringFromPatter(recipe.key, recipe.pattern)}\n`;
            for (const key of Object.keys(recipe.key)) {
                description += `Using **${itemTranslation(itemOrTagString(recipe.key[key]), lang)}** as **\`${key}\`**\n`;
            }
            break;
        case 'minecraft:stonecutting':
            description = `You can craft **${recipe.count || 1} ${itemTranslation(item, lang)}** using **${itemTranslation(itemOrTagString(recipe.ingredient), lang)}** in a stonecutter`;
            break;
        case 'minecraft:blasting':
            description = `You can make a **${itemTranslation(item, lang)}** by blasting **${itemTranslation(itemOrTagString(recipe.ingredient), lang)}** in a blast furnace for ${recipe.cookingtime/20} seconds`;
            break;
        case 'minecraft:smelting':
            description = `You can make a **${itemTranslation(item, lang)}** by smelting **${itemTranslation(itemOrTagString(recipe.ingredient), lang)}** in a furnace for ${recipe.cookingtime/20} seconds`;
            break;
        case 'minecraft:smithing_transform':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using a **${itemTranslation(itemOrTagString(recipe.addition), lang)}** on a **${itemTranslation(itemOrTagString(recipe.base), lang)}** with a **${itemTranslation(itemOrTagString(recipe.template), lang)}**`
            break;
        case 'minecraft:campfire_cooking':
            description = `You can make a **${itemTranslation(item, lang)}** by smelting **${itemTranslation(itemOrTagString(recipe.ingredient), lang)}** on a campfire for ${recipe.cookingtime/20} seconds`;
            break;
        case 'minecraft:smoking':
            description = `You can make a **${itemTranslation(item, lang)}** by smelting **${itemTranslation(itemOrTagString(recipe.ingredient), lang)}** in a smoker for ${recipe.cookingtime/20} seconds`;
            break;

        //Meadow recipes
        case 'meadow:woodcutting':
            description = `You can craft **${recipe.outputAmount || 1} ${itemTranslation(item, lang)}** using **${itemTranslation(itemOrTagString(recipe.inputItem), lang)}** in a woodcutter`;
            break;
        case 'meadow:cooking':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += "in a cooking pot";
            break;
        case 'meadow:cheese':
            description = `You can make a **${itemTranslation(item, lang)}** using **${itemTranslation(itemOrTagString(recipe.bucket), lang)}** and **${itemTranslation(itemOrTagString(recipe.ingredient), lang)}**`;
            break;
        case 'meadow:fondue':
            description = `You can make a **${itemTranslation(item, lang)}** using **${itemTranslation(itemOrTagString(recipe.fuel), lang)}** and **${itemTranslation(itemOrTagString(recipe.bread), lang)}**`;
            break;

        //Vinery recipes
        case 'vinery:apple_mashing':
            description = `You can make a **${itemTranslation(item, lang)}** by mashing **${itemTranslation(itemOrTagString(recipe.input), lang)}** in an apple press`;
            break;
        case 'vinery:wine_fermentation':
            description = `You can craft a **${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a fermentation barrel`;
            break;

        //Bakery recipes
        case 'bakery:stove':
            description = `You can craft **${recipe.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a stove`;
            break;
        case 'bakery:pot_cooking':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a cooking pot, with **${itemTranslation(itemOrTagString(recipe.container), lang)}** as a container`;
            break;
        case 'bakery:crafting_bowl':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a crafting bowl`;
            break;
        case 'bakery:baking_station':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a baking station`;
            break;

        //Candlelight recipes
        case 'candlelight:pot_cooking':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item ,lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a cooking pot, with **${itemTranslation(itemOrTagString(recipe.container), lang)}** as a container`;
            break;
        case 'candlelight:pan_cooking':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a cooking pan, with **${itemTranslation(itemOrTagString(recipe.container), lang)}** as a container`;
            break;
            
        //Beachpary recipes
        case 'beachparty:tiki_bar_mixing':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a tiki bar`;
            break;
        case 'beachparty:mini_fridge_mixing':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a mini fridge`;
            break;

        //Herbalbrews recipes
        case 'herbalbrews:kettle_brewing':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a kettle`;
            break;
        case 'herbalbrews:cauldron_brewing':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** using:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            description += `in a cauldron`;
            break;

        //Brewery recipes
        case 'brewery:brewing':
            description = `You can craft **${recipe.result?.count || 1} ${itemTranslation(item, lang)}** by brewing:\n`;
            for (const ingredient of recipe.ingredients) {
                description += `- ${itemTranslation(itemOrTagString(ingredient), lang)}\n`;
            }
            break;


        default:
            description = `Could't generate recipe (recipe type \`${recipe.type}\` not implemented)`;
            break;
    }
    recipeEmbed.setDescription(description);
    return {embed: recipeEmbed};
}

function itemOrTagString(data){
    if(data?.tag) return `any #${data.tag}`;
    else if(data?.item) return `${data.item}`;
    return "";
}

function craftStringFromPatter(key, pattern){
    const patternString = `\`\`\`╔═╦═╦═╗\n`
    +`║${pattern[0][0]}║${pattern[0][1]}║${pattern[0][2]}║\n`
    +`╠═╬═╬═╣\n`
    +`║${pattern[1][0]}║${pattern[1][1]}║${pattern[1][2]}║\n`
    +`╠═╬═╬═╣\n`
    +`║${pattern[2][0]}║${pattern[2][1]}║${pattern[2][2]}║\n`
    +`╚═╩═╩═╝\`\`\`\n`
    return patternString;
}
