"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPollaCommand = void 0;
const polla_1 = require("../schemas/polla"); // Ajusta la ruta si es necesario
// Handler de ejemplo para el comando (útil para tu sistema de comando handler)
const createPollaCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const nombre = interaction.options.getString('nombre', true);
    const equiposString = interaction.options.getString('equipos', true);
    const descripcion = interaction.options.getString('descripcion') || '';
    const equipos = equiposString.split(',').map(e => {
        const [name, alias] = e.split(':').map(s => s.trim());
        return { name: name || '', alias: alias || (name || '').toLowerCase() };
    });
    // Crea la polla en la base de datos
    const polla = yield polla_1.Polla.create({
        name: nombre,
        teams: equipos,
        matches: [],
        users: [],
        status: 'open',
        createdAt: new Date()
    });
    yield interaction.reply(`✅ ¡Polla **${nombre}** creada con éxito con ${equipos.length} equipos!\nPuedes agregar partidos usando /create-match.`);
});
exports.createPollaCommand = createPollaCommand;
exports.default = exports.createPollaCommand;
