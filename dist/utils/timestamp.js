"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.horaSimpleConHrs = horaSimpleConHrs;
exports.diaSimple = diaSimple;
function horaSimpleConHrs(date, timeZone = 'America/Bogota') {
    const [horas, minutos] = date
        .toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone })
        .split(':');
    return `${horas}:${minutos} hrs`;
}
function diaSimple(date, timeZone = 'America/Bogota') {
    const opciones = { day: '2-digit', month: '2-digit', timeZone };
    const [dia, mes] = date
        .toLocaleDateString('es-PE', opciones)
        .split('/')
        .map((parte) => parte.padStart(2, '0'));
    return `${dia}/${mes}`;
}
