import { debugNotNull, h } from "myjam";
import css from "./main.module.css";

const searchParams = new URLSearchParams(document.location.search);
const params = {
  // Number of particles allocated in the arena.
  p: parseInt(searchParams.get("p") || "200", 10),

  // Number of particles used by each action.
  n: parseInt(searchParams.get("n") || "50", 10),

  // Width of the basic particle, in pixels.
  w: parseInt(searchParams.get("w") || "64", 10),

  // Height of the basic particle, in pixels.
  h: parseInt(searchParams.get("h") || "64", 10),
} as const;

const particles = Array.from({ length: params.p }, () =>
  h("div", {
    class: css["particleCircle"],
    style: `width:${params.w}px;height:${params.h}px`,
  }),
);

let nextParticleIndex = 0;
const nextParticle = (): HTMLDivElement => {
  /* Use particles in strict round-robin order. This is far simpler than
   * tracking which particles have timed out, and we can later divide them into
   * multiple arenas if there are e.g. long-lived and short-lived particles.
   */
  const result = debugNotNull(particles[nextParticleIndex]);
  nextParticleIndex = (nextParticleIndex + 1) % particles.length;
  return result;
};

const ACTIONS = {
  Explode(x: number, y: number): void {
    for (let i = 0; i < params.n; i += 1) {
      const particle = nextParticle();

      const th = 2 * Math.PI * Math.random();
      const vel = 50 * Math.random() + 20;

      const x1 = x + vel * Math.cos(th);
      const y1 = y + vel * Math.sin(th);
      const x2 = x + 1.25 * vel * Math.cos(th);
      const y2 = y + 1.25 * vel * Math.sin(th);

      /* Using the animation API should let the browser offload work to the GPU.
       * At very least, it avoids running our JS code for every frame.
       */
      particle.animate(
        [
          {
            "--fg": "#ff0",
            transform: `translate(${x}px,${y}px)scale(0.5)`,
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
  },
  Circle(x: number, y: number): void {
    for (let i = 0; i < params.n; i += 1) {
      const particle = nextParticle();

      const vel = 200;
      const angle = 2 * Math.PI * Math.random();
      const dx = vel * Math.cos(angle);
      const dy = vel * Math.sin(angle);

      const options: KeyframeAnimationOptions = {
        duration: 1000,
      };
      particle.animate(
        {
          "--fg": ["#f00", "#f00"],
          transform: [
            `translate(${x}px,${y}px)`,
            `translate(${x + dx}px,${y + dy}px)`,
          ],
          opacity: [1.0, 0.0],
        },
        options,
      );
    }
  },
  Spray(x: number, y: number): void {
    for (let i = 0; i < params.n; i += 1) {
      const particle = nextParticle();

      const dx = 200 * Math.random() - 100;
      const dy = 100;
      const jump = -(2 * Math.random() + 2);

      const options: KeyframeAnimationOptions = {
        duration: 1000,
        delay: 10 * i,
      };
      particle.animate(
        {
          "--fg": ["#00f", "#00f"],
          transform: [`translateX(${x}px)`, `translateX(${x + dx}px)`],
          opacity: [1.0, 0.0],
          easing: "cubic-bezier(0, 0, 0.95, 1)",
        },
        options,
      );
      particle.animate(
        {
          transform: [`translateY(${y}px)`, `translateY(${y + dy}px)`],
          easing: `cubic-bezier(0.5, ${jump}, 1, 1)`,
        },
        { ...options, composite: "add" },
      );
    }
  },
} as const;

document.body.append(
  h("div", { class: css["app"] }, [
    h("div", { class: css["vert"] }, [
      h(
        "a",
        {
          href: "https://github.com/crlfe/myjam/blob/main/examples/particles-dom/src/main.ts",
        },
        ["View Source"],
      ),
      h("p", { style: "max-width:30rem" }, [
        "This generates random particles using pre-created DIV elements, ",
        "which translate/scale and change color through the animation. ",
        "Running thousands of particles this way is a performance problem, but ",
        "Chrome & FF on my old Linux laptop have no problem with fifty.",
      ]),
      h("p", { style: "max-width:30rem" }, [
        "A WebGL2/WebGPU-based particle system should be much more efficient, but this ",
        "has the advantage of working without any canvas or custom shader compilation.",
      ]),
      Object.entries(ACTIONS).map(([name, callback]) =>
        h("button", {}, [
          name,
          (button) =>
            button.addEventListener("click", (event) =>
              callback(event.x - params.w / 2, event.y - params.h / 2),
            ),
        ]),
      ),
    ]),
    h(
      "div",
      {
        style: "pointer-events:none;position:relative;width:100%;height:100%;",
      },
      particles,
    ),
  ]),
);
