import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("wiki")
        .setDescription("Search the recipe for an item")
        .addStringOption(option => option
            .setName("mod")
            .setDescription("Which mod's wiki I should display")
            .setChoices(
				{ name: 'Bakery', value: 'bakery' },
				{ name: 'Brewery', value: 'brewery' },
				{ name: 'HerbalBrews', value: 'herbalbrews' },
				{ name: 'Meadow', value: 'meadow' },
				{ name: 'Vinery', value: 'vinery' },
            )
            .setRequired(true)),
    async execute(interaction, client){
        const option = interaction.options.getString('mod');
        if(!option in Object.keys(wikis)) return interaction.reply({content: "This mod doesn't have a wiki !", ephemearl: true});
        const wikiEMBED = new EmbedBuilder()
            .setTitle(`${capitalizeFirstLetter(option)}`)
            .setDescription(`[${capitalizeFirstLetter(option)}'s wiki](${wikis[option].link})`);
        await interaction.reply({embeds: [wikiEMBED]});
    }
}

const wikis = {
    bakery: {
        link: "https://github.com/satisfyu/Bakery/wiki"
    },
    beachpary: {
        link: "https://github.com/satisfyu/Beachparty/wiki"
    },
    bloomingnature: {
        link: "https://github.com/satisfyu/BloomingNature/wiki"
    },
    brewery: {
        link: "https://github.com/satisfyu/Brewery/wiki"
    },
    candlelight: {
        link: "https://github.com/satisfyu/Candlelight/wiki"
    },
    herbalbrews: {
        link: "https://github.com/satisfyu/HerbalBrews/wiki"
    },
    meadow: {
        link: "https://github.com/satisfyu/Meadow/wiki"
    },
    nethervinery: {
        link: "https://github.com/satisfyu/NetherVinery/wiki"
    },
    vinery: {
        link: "https://github.com/satisfyu/Vinery/wiki"
    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
