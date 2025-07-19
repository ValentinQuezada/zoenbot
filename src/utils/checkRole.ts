import { CommandInteraction, Interaction } from "discord.js";

export async function checkRole(interaction: CommandInteraction, roleName: string): Promise<boolean> {
  if (!interaction.inGuild()) return false;

  try {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) return false;

    const memberRoles = member.roles.valueOf();
    const roleNames = memberRoles.map(role => role.name.toLowerCase());

    return roleNames.includes(roleName.toLowerCase());
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}

