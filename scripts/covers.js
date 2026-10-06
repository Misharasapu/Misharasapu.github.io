// Project cover controller. One cover plays at a time:
// on mouse devices, the hovered or focused card; on touch screens, the most
// visible card, once, stopping when it scrolls away. Reduced motion: none play.
(() => {
  const cards = [...document.querySelectorAll("[data-cover]")];
  if (!cards.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let current = null;

  function play(card) {
    if (current && current !== card) current.classList.remove("is-playing");
    card.classList.remove("is-playing");
    void card.offsetWidth; // restart the CSS animations
    card.classList.add("is-playing");
    current = card;
  }

  function stop(card) {
    card.classList.remove("is-playing");
    if (current === card) current = null;
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer) {
    for (const card of cards) {
      card.addEventListener("pointerenter", () => play(card));
      card.addEventListener("pointerleave", () => stop(card));
      card.addEventListener("focusin", () => play(card));
      card.addEventListener("focusout", () => stop(card));
    }
    return;
  }

  // Touch: play the single most visible card once
  if (!("IntersectionObserver" in window)) return;
  const ratios = new Map();
  const played = new WeakSet();
  let pending = 0;

  const choose = () => {
    pending = 0;
    let best = null, bestRatio = 0.6;
    for (const [card, r] of ratios) {
      if (r >= bestRatio && !played.has(card)) {
        best = card;
        bestRatio = r;
      }
    }
    if (best && best !== current) {
      played.add(best);
      play(best);
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        ratios.set(e.target, e.intersectionRatio);
        if (e.target === current && e.intersectionRatio < 0.2) stop(e.target);
      }
      if (!pending) pending = setTimeout(choose, 150);
    },
    { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
  );
  cards.forEach((c) => io.observe(c));
})();
