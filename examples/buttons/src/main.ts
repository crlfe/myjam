import { h } from "myjam";

import css from "./main.module.css";

document.body.append(
  h("div", { class: css["app"] }, [
    h("div", { class: css["bordered"] + " " + css["vert"] }, [
      h(
        "a",
        {
          href: "https://github.com/crlfe/myjam/blob/main/examples/buttons/src/main.ts",
        },
        ["View Source"],
      ),
      h("button", { class: css["bordered"] }, ["Start"]),
      h("button", { class: css["bordered"] }, ["Start Muted"]),
      h("button", { class: css["bordered"] }, ["Options"]),
    ]),
  ]),
);
