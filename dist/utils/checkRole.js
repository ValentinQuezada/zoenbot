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
exports.checkRole = checkRole;
function checkRole(interaction, roleName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!interaction.inGuild())
            return false;
        try {
            const member = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id));
            if (!member)
                return false;
            const memberRoles = member.roles.valueOf();
            const roleNames = memberRoles.map(role => role.name.toLowerCase());
            return roleNames.includes(roleName.toLowerCase());
        }
        catch (error) {
            console.error("Error checking role:", error);
            return false;
        }
    });
}
