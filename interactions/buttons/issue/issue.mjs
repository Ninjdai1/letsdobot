import { EmbedBuilder, PermissionsBitField } from "discord.js";

export default {
    async execute(interaction, client) {
        switch (interaction.customId.split("_")[1]) {
            case "resolve":
                await interaction.deferUpdate();
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
    if((interaction.user.id != interaction.channel.ownerId) && (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages, true))){
        await interaction.editReply();
        return interaction.followUp({
            content: "You are not allowed to close this thread",
            ephemeral: true
        });
    }
    await interaction.editReply({components: [], content: `Thread marked as resolved by <@${interaction.user.id}>`});
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
        + `* Vanilla: Navigate to your .minecraft folder (on Windows, using WIN+R and typing %appdata%), in which the logs folder is located\n`
        + `* Prism/MultiMC: Open the instance's folder, then navigate to .minecraft/logs\n`
        + `* Curseforge: Open the instance's folder, then navigate to the logs folder\n`
    )
