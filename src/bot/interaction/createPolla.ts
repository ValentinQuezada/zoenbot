import { ChatInputCommandInteraction } from "discord.js";
import { Polla } from "../../schemas/polla"; // Ajusta la ruta si es necesario

// Handler de ejemplo para el comando (útil para tu sistema de comando handler)
export const createPollaCommand = async (interaction: ChatInputCommandInteraction) => {
  const nombre = interaction.options.getString('nombre', true);
  const equiposString = interaction.options.getString('equipos', true);
  const descripcion = interaction.options.getString('descripcion') || '';

  const equipos = equiposString.split(',').map(e => {
    const [name, alias] = e.split(':').map(s => s.trim());
    return { name: name || '', alias: alias || (name || '').toLowerCase() };
  });

  // Crea la polla en la base de datos
  const polla = await Polla.create({
    name: nombre,
    teams: equipos,
    matches: [],
    users: [],
    status: 'open',
    createdAt: new Date()
  });

  await interaction.reply(`✅ ¡Polla **${nombre}** creada con éxito con ${equipos.length} equipos!\nPuedes agregar partidos usando /create-match.`);
};

export default createPollaCommand;