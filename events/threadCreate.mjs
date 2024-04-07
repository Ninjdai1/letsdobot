import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } from "discord.js";
import config from "../config.json" assert { type: "json" };

export default {
    name: Events.ThreadCreate,
    async execute(thread, client) {
        console.log(thread);
        if(thread.parentId == ISSUES_CHANNEL){
            await sleep(2*1000);
            await thread.send({
                embeds: [issueEmbed],
                components: [issueRow],
            });
        }
    },
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ISSUES_CHANNEL = '1100521080373919945';

const issueEmbed = new EmbedBuilder()
    .setTitle(`Someone will come and help soon!`)
    .setDescription(
        `💬 While you wait, take this time to provide more context and details.\n\n`
        + `💾 If you're experiencing crashes, please attach your \`latest.log\` (tutorial on how to get them below).\n\n`
        + `✅ Once your question has been resolved (or you no longer need it), please click Resolve Question.`
    )
    .setColor("#FBDB74")

const issueRow = new ActionRowBuilder()
    .setComponents([
        new ButtonBuilder()
            .setEmoji("🆘")
            .setLabel("Get logs")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("issue_logs"),
        new ButtonBuilder()
            .setEmoji("✅")
            .setLabel("Resolve")
            .setStyle(ButtonStyle.Success)
            .setCustomId("issue_resolve"),
    ])
