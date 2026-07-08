/* Theme toggle: dark is the default; the choice persists in localStorage.
   A tiny inline script in <head> sets data-theme before first paint. */
(function () {
  const meta = document.querySelector('meta[name="theme-color"]');
  const btn = document.getElementById("theme-toggle");

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("kc-theme", theme); } catch (e) {}
    if (meta) meta.content = theme === "light" ? "#346eaa" : "#000000";
    if (btn) btn.setAttribute("aria-label",
      theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  }

  apply(document.documentElement.dataset.theme === "light" ? "light" : "dark");

  btn?.addEventListener("click", () => {
    apply(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  });
})();
