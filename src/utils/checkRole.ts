import { CommandInteraction, Interaction } from "discord.js";

export async function checkRole(interaction: CommandInteraction, roleName: string): Promise<boolean> {
  if (!interaction.inGuild()) return false;

  try {
    // Obtener el miembro actualizado del servidor
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) return false;

    // Convertir a array de nombres de roles en minúsculas
    const memberRoles = member.roles.valueOf(); // Obtiene Collection<string, Role>
    const roleNames = memberRoles.map(role => role.name.toLowerCase());

    return roleNames.includes(roleName.toLowerCase());
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}