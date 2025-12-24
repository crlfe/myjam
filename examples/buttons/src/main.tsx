import css from "./main.module.css";

const logTextOnClick = (e: HTMLButtonElement) => {
  e.addEventListener("click", () => {
    console.log(e.textContent);
  });
};

document.body.append(
  <div class={css["app"]}>
    <div class={`${css["bordered"]} ${css["vert"]}`}>
      <a href="https://github.com/crlfe/myjam/blob/main/examples/buttons/src/main.tsx">
        View Source
      </a>

      <button class={css["bordered"]}>{logTextOnClick}Start</button>
      <button class={css["bordered"]}>{logTextOnClick}Start Muted</button>
      <button class={css["bordered"]}>{logTextOnClick}Options</button>
    </div>
  </div>,
);
