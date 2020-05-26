import axios from "axios";
import { GluegunToolbox } from "gluegun";

module.exports = {
  async run(toolbox: GluegunToolbox) {
    const {
      print: { info, colors },
    } = toolbox;

    const spinner = toolbox.print.spin("Loading...");

    const frameworks = (await axios(
      "https://api.github.com/repos/Standard-Structure/Standard-Structure/contents/frameworks",
    )).data.filter((i) => i.type === "dir").map((i) => i.name);
    const languages = (await axios(
      "https://api.github.com/repos/Standard-Structure/Standard-Structure/contents/languages",
    )).data.filter((i) => i.type === "dir").map((i) => i.name);

    spinner.stop();

    info(colors.muted("Frameworks"));
    info(frameworks.join("\n") + "\n");

    info(colors.muted("Languages"));
    info(languages.join("\n"));
  },
};
