import { SlashCommandBuilder, EmbedBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"
import { wikis } from "../../util/wikis.mjs";

const command = new SlashCommandBuilder()
    .setName("wiki")
    .setDescription("Search the recipe for an item")

Object.keys(wikis).forEach(modId => {
    const mod = wikis[modId];
    if(!mod.disabled){
        const modDisplayName = capitalizeFirstLetter(modId);
        const subcommandgroup = new SlashCommandSubcommandGroupBuilder()
            .setName(modId)
            .setDescription(`${capitalizeFirstLetter(modId)}'s wiki`);

        subcommandgroup.addSubcommand(subcommand => subcommand
            .setName("home")
            .setDescription(`Wiki's Home`)
        )
        
        if(!mod.pages) return;
        for(const page of Object.keys(mod.pages)){
            const pageDiplayName = capitalizeFirstLetter(page).replace("-", " ");
            
            const subcommand = subcommand => subcommand
                .setName(page.toLowerCase())
                .setDescription(`${modDisplayName} Wiki Page for ${pageDiplayName}`)
                .addStringOption(option => {
                    option.setName("tag").setDescription("The tag to point to").setRequired(false);
                    for(const tag of mod.pages[page]){
                        const tagDiplayName = capitalizeFirstLetter(tag).replace("-", " ");
                        option.addChoices({name: tagDiplayName, value: tag});
                    };
                    return option;
                });
            subcommandgroup.addSubcommand(subcommand);
        }
        command.addSubcommandGroup(subcommandgroup);
    }
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {
    data: command,
    async execute(interaction, client){
        await interaction.deferReply();
        console.log(interaction.options)
        const mod = interaction.options.getSubcommandGroup();
        const page = interaction.options.getSubcommand();
        const finalPage = page=="home" ? "" : page;
        const tag = interaction.options?.getString("tag", false);
        const finalTag = tag ? `#${tag}` : undefined;

        const description = `[${capitalizeFirstLetter(mod)}'s wiki: ${capitalizeFirstLetter(page)}${finalTag ? ` (${finalTag})` : ""}](${wikis[mod].link}/${finalPage}${finalTag||""})`

        console.log(description)

        if(!mod in Object.keys(wikis)) return await interaction.editReply({content: "This mod doesn't have a wiki !", ephemeral: true});
        const wikiEMBED = new EmbedBuilder()
            .setTitle(`${capitalizeFirstLetter(mod)}`)
            .setDescription(description);
        await interaction.editReply({embeds: [wikiEMBED]});
    }
}
