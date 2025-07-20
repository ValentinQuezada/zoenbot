import sayCommand from "../commands/say";
import createMatch from "../commands/createMatch";
import setGroupStageOnlyCommand from "../commands/setGroupStageOnly";
import seeMatchesCommand from "../commands/seeMatches";
import { set } from "mongoose";

const commands = [
  sayCommand,
  createMatch,
  setGroupStageOnlyCommand,
  seeMatchesCommand
];

export default commands;