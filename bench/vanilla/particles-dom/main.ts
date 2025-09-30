const searchParams = new URLSearchParams(document.location.search);
const params = {
  // Number of particles allocated in the arena.
  p: parseInt(searchParams.get("p") || "50", 10),

  // Number of particles used by each action.
  n: parseInt(searchParams.get("n") || "50", 10),

  // Width of the basic particle, in pixels.
  w: parseInt(searchParams.get("w") || "32", 10),

  // Height of the basic particle, in pixels.
  h: parseInt(searchParams.get("h") || "32", 10),
} as const;


// Create the particle arena. Particle are often triggered in large batches
// in response to user actions, so we benefit from getting everything
// allocated in advance. The size of the arena also puts a hard limit on
// number of active particles, because we will reuse older divs whether or
// not they have actually finished their animations.
const particles = Array.from({ length: params.p }, () => {
  const e = document.createElement("div");
  e.className = "particle";

  // Always use a fixed width and height. Any scaling is done via transform,
  // so that the browser can reuse any rendered version of the particle.
  e.style = `width:${params.w}px;height:${params.h}px`;
  return e;
});
let nextParticle = 0;

// TODO: Scale the partial effect base on the size of the parent div?

const ACTIONS = {
  Circle() {
    // Launch all particles from the center of the window.
    const x = layer.clientWidth / 2;
    const y = layer.clientHeight / 2;

    for (let i = 0; i < params.n; i++) {
      // Use particles in strict round-robin order. This is far simpler than
      // tracking which particles have timed out, and we can divide them into
      // multiple arenas if there are long-lived and short-lived particles.
      const particle = particles[nextParticle++ % particles.length]!;

      const vel = 100;
      const angle = 2 * Math.PI * Math.random();
      const dx = vel * Math.cos(angle);
      const dy = vel * Math.sin(angle);

      // Using the animation API may let the browser offload work to the GPU.
      // At very least, it avoids running our JS code for every frame.
      const options: KeyframeAnimationOptions = {
        duration: 1000,
      };
      particle.animate(
        {
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
  Spray() {
    const x = layer.clientWidth / 2;
    const y = layer.clientHeight / 2;

    for (let i = 0; i < params.n; i++) {
      const particle = particles[nextParticle++ % particles.length]!;

      const dx = 200 * Math.random() - 100;
      const dy = 100;
      const jump = -(2 * Math.random() + 1);

      const options: KeyframeAnimationOptions = {
        composite: "add",
        duration: 1000,
        delay: 10 * i,
      };
      particle.animate(
        {
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
        options,
      );
    }
  },
} satisfies Record<string, () => void>;

// Create a toolbar with buttons for the actions.
const nav = document.createElement("nav");
document.body.append(nav);
for (const [name, callback] of Object.entries(ACTIONS)) {
  const button = document.createElement("button");
  button.textContent = name;
  button.addEventListener("click", callback);
  nav.append(button);
}

// Create a single full-window parent for all of the particles.
const layer = document.createElement("div");
layer.className = "particle-layer";
layer.append(...particles);
document.body.append(layer);
