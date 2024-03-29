import { ActivityType } from "discord.js";
import config from "../config.json" assert { type: "json" };

export default {
    name: "ready",
    once: true,
    async execute(client) {
        console.log("Prête");
        client.user.setStatus("online");

        let status_list = [
            [ActivityType.Playing, "Minecraft", "with the Let's Do modpack"],
            [ActivityType.Custom, "Sleeping"],
            [ActivityType.Custom, "Reading the wiki"]
        ];
        client.user.setActivity({
            type: status_list[0][0],
            name: status_list[0][1],
            state: status_list[0][2],
        });
        setInterval(() => {
            const Random = Math.floor(Math.random() * status_list.length);
            if (config.cycleStatuses) {
                client.user.setActivity({
                    type: status_list[Random][0],
                    name: status_list[Random][1],
                    state: status_list[Random][2],
                });
            }
        }, 2 * 60 * 1000);
    },
};
