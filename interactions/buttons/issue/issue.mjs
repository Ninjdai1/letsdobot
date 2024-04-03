import { EmbedBuilder } from "discord.js";

export default {
    async execute(interaction, client) {
        await interaction.deferUpdate();
        switch (interaction.customId.split("_")[1]) {
            case "resolve":
                await closeThread(interaction);
                break;
            case "logs":
                await showHelp(interaction);
                break;
        }
    },
};

const RESOLVED_TAG_ID = '1100522220914212979';

async function closeThread(interaction){
    await interaction.editReply({components: []});
    await interaction.channel.setAppliedTags([...interaction.channel.appliedTags, RESOLVED_TAG_ID])
    await interaction.channel.setLocked(true);
    await interaction.channel.setArchived(true);
}

async function showHelp(interaction){
    await interaction.reply({
        embeds: [logsEmbed],
        ephemeral: true,
    })
}

const logsEmbed = new EmbedBuilder()
    .setTitle("How to get your logs")
    .setDescription(
        `Depending on the launcher you use, your logs are located in different folders:\n`
        + `* Vanilla: Navigate to your .minecraft folder (on Windows, using WIN+R and typing %appdata%), in which the logs folder is located`
        + `* Prism/MultiMC: Open the instance's folder, then navigate to .minecraft/logs`
        + `* Curseforge: Open the instance's folder, then navigate to the logs folder`
    )
