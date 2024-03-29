/*import { buttonList } from "../interactions/buttons/index.mjs";
import { modalList } from "../interactions/modals/index.mjs";
import { selectMenuList } from "../interactions/selectmenus/index.mjs";*/

export default {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (
            interaction.isChatInputCommand() ||
            interaction.isContextMenuCommand()
        ) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                try {
                    await interaction.reply({
                        content:
                            "There was an error while executing this command!",
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }/* else if (interaction.isButton()) {
            const customId = interaction.customId.split("_")[0];
            if (customId == "ignore") return;
            buttonList[customId]
                ? buttonList[customId].execute(interaction, client)
                : interaction.reply({
                      content:
                          "Si vous rencontrez cette erreur, merci de contacter CoolMan#4094 !",
                      ephemeral: true,
                  });
        } else if (interaction.isStringSelectMenu()) {
            const customId = interaction.customId.split("_")[0];
            if (customId == "ignore") return;
            selectMenuList[customId].execute(interaction, client);
        } else if (interaction.isModalSubmit()) {
            if (customId == "ignore") return;
            modalList[interaction.customId.split("_")[0]]
                ? modalList[interaction.customId.split("_")[0]].execute(
                      interaction,
                      client,
                  )
                : interaction.reply({
                      content:
                          "Si vous rencontrez cette erreur, merci de contacter CoolMan#4094 !",
                      ephemeral: true,
                  });
        } else {
            console.log(interaction);
        }*/
    },
};
