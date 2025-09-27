import { h } from "myjam/dom";
import { debugNotNull } from "myjam/util";

import "myjam/global.css";
import css from "myjam/combined.module.css";

debugNotNull(document.getElementById("app")).replaceChildren(
  h("div", { class: css["bordered"] + " " + css["vert"] }, [
    h("button", { class: css["bordered"] }, ["Start"]),
    h("button", { class: css["bordered"] }, ["Start Muted"]),
    h("button", { class: css["bordered"] }, ["Options"]),
  ]),
);
