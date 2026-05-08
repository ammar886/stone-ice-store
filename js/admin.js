(function () {
  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function bindLoginPage() {
    var form = document.getElementById("admin-login-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = String(document.getElementById("admin-email").value || "").trim();
      var password = String(document.getElementById("admin-password").value || "");
      var error = document.getElementById("admin-login-error");

      if (email && password) {
        window.location.href = "admin-dashboard.html";
        return;
      }

      error.textContent = "Email and password are required.";
    });
  }

  function renderDashboardTable() {
    var body = document.getElementById("admin-products-body");
    if (!body) return;

    var products = window.getAllProducts ? window.getAllProducts() : window.STORE_PRODUCTS || [];
    body.innerHTML = "";

    products.forEach(function (product) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" +
        escapeHtml(product.name) +
        "</td>" +
        "<td>" +
        escapeHtml(product.description || product.blurb || "") +
        "</td>" +
        '<td><img class="admin-product-image" src="' +
        escapeHtml(product.image || "") +
        '" alt="" /></td>' +
        '<td><div class="admin-actions">' +
        '<button class="btn" type="button" data-action="edit" data-id="' +
        escapeHtml(product.id) +
        '">Edit</button>' +
        '<button class="btn" type="button" data-action="delete" data-id="' +
        escapeHtml(product.id) +
        '">Delete</button>' +
        "</div></td>";
      body.appendChild(tr);
    });
  }

  function bindDashboardPage() {
    var root = document.getElementById("admin-dashboard-page");
    if (!root) return;

    var addBtn = document.getElementById("admin-add-product");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        window.location.href = "admin-add-product.html";
      });
    }

    var table = document.getElementById("admin-products-table");
    if (table) {
      table.addEventListener("click", function (event) {
        var target = event.target;
        if (!(target instanceof HTMLButtonElement)) return;

        var action = target.getAttribute("data-action");
        var id = target.getAttribute("data-id");
        if (!id) return;

        if (action === "delete") {
          if (typeof window.deleteProduct === "function") {
            window.deleteProduct(id);
            renderDashboardTable();
          }
          return;
        }

        if (action === "edit") {
          var product = (window.getAllProducts ? window.getAllProducts() : []).find(function (p) {
            return String(p.id) === String(id);
          });
          if (!product) return;

          var nextTitle = window.prompt("Product title", product.name);
          if (nextTitle === null) return;
          var nextDescription = window.prompt(
            "Product description",
            product.description || product.blurb || ""
          );
          if (nextDescription === null) return;
          var nextImage = window.prompt("Product image URL", product.image || "");
          if (nextImage === null) return;

          if (typeof window.updateProduct === "function") {
            window.updateProduct(id, {
              name: nextTitle,
              description: nextDescription,
              image: nextImage,
            });
            renderDashboardTable();
          }
        }
      });
    }

    renderDashboardTable();
  }

  function bindAddProductPage() {
    var form = document.getElementById("admin-add-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var title = String(document.getElementById("product-title").value || "").trim();
      var description = String(document.getElementById("product-description").value || "").trim();
      var image = String(document.getElementById("product-image").value || "").trim();

      if (!title || !description || !image) return;

      if (typeof window.addProduct === "function") {
        window.addProduct({
          name: title,
          description: description,
          image: image,
        });
      }

      window.location.href = "admin-dashboard.html";
    });
  }

  bindLoginPage();
  bindDashboardPage();
  bindAddProductPage();
})();
