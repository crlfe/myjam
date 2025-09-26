import { h } from "./dom";
import { debugNotNull } from "./util";

import "./global.css";
import css from "./main.module.css";

debugNotNull(document.getElementById("app")).replaceChildren(
  h("div", { class: css["bordered"] + " " + css["vert"] }, [
    h("button", { class: css["bordered"] }, ["Start"]),
    h("button", { class: css["bordered"] }, ["Start Muted"]),
    h("button", { class: css["bordered"] }, ["Options"]),
  ]),
);
