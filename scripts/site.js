// Shared behaviour for every page: marks JS as available and adds the
// figure reveal. Content is visible without this file; it only adds effects.
(() => {
  document.documentElement.classList.add("js");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  // Only hide things that start below the fold, so nothing on screen blinks.
  const targets = [...document.querySelectorAll(".figure__frame, .table-scroll, .cm")].filter(
    (el) => el.getBoundingClientRect().top > window.innerHeight
  );
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  for (const el of targets) {
    el.classList.add("reveal-ready");
    io.observe(el);
  }
})();
