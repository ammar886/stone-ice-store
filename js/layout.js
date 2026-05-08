/**
 * Active nav link + small helpers used on every page.
 */
(function () {
  document.documentElement.classList.add("js");

  function setActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop();
      var match =
        href === path ||
        (path === "" && href === "index.html") ||
        (path === "product.html" && href === "products.html");
      if (match) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setActiveNav);
  } else {
    setActiveNav();
  }

  window.formatPrice = function (n) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(n);
  };

  function sourceProducts() {
    return window.STORE_PRODUCTS || [];
  }

  window.getProductById = function (id) {
    return sourceProducts().find(function (p) {
      return String(p.id) === String(id);
    });
  };

  window.featuredProducts = function () {
    return sourceProducts().slice(0, 4);
  };
})();
