import { h } from "myjam/dom";
import { debugNotNull } from "myjam/util";

import "myjam/global.css";
import css from "myjam/combined.module.css";

let nextParticle = 0;
const particles = Array.from({ length: 500 }, () =>
  h("div", { class: css["particleCircle"] }),
);

debugNotNull(document.getElementById("app")).replaceChildren(
  h("div", { class: css["bordered"] + " " + css["vert"] }, [
    h("p", { style: "max-width:30rem" }, [
      "This generates fifty random particles using pre-created DIV elements, ",
      "which translate/scale and change color through the animation. ",
      "Running hundreds of particles this way is a performance problem, but ",
      "Chrome & FF on my old Linux laptop have no problem with dozens.",
    ]),
    h("p", { style: "max-width:30rem" }, [
      "A WebGL2/WebGPU-based particle system should be much more efficient, but this ",
      "has the advantage of working without any canvas or custom shader compilation.",
    ]),
    h("button", { class: css["bordered"] }, [
      "Explode",
      (button) => {
        button.addEventListener("click", (event) => {
          explode(event.x, event.y);
        });
      },
    ]),
  ]),
  h(
    "div",
    { style: "pointer-events:none;position:relative;width:100%;height:100%;" },
    particles,
  ),
);

const explode = (x: number, y: number): void => {
  for (let i = 0; i < 50; i++) {
    const particle = debugNotNull(particles[nextParticle++ % particles.length]);

    const th = 2 * Math.PI * Math.random();
    const vel = 50 * Math.random() + 20;

    // Particle size is fixed at 64x64, in hopes the browser will scale them efficiently.
    const x0 = x - 32;
    const y0 = y - 32;
    const x1 = x0 + vel * Math.cos(th);
    const y1 = y0 + vel * Math.sin(th);
    const x2 = x0 + 1.25 * vel * Math.cos(th);
    const y2 = y0 + 1.25 * vel * Math.sin(th);

    particle.animate(
      [
        {
          "--fg": "#ff0",
          transform: `translate(${x0}px,${y0}px)scale(0.5)`,
          opacity: 1,
        },
        {
          "--fg": "#f80",
          transform: `translate(${x1}px,${y1}px)scale(1.0)`,
          opacity: 1,
        },
        {
          "--fg": "#fff",
          transform: `translate(${x2}px,${y2}px)scale(3.0)`,
          opacity: 0,
        },
      ],
      { duration: 300 * Math.random() + 500 },
    );
  }
};
