(function () {
  function getClient() {
    return window.supabaseClient || null;
  }

  async function isAuthenticated() {
    var client = getClient();
    if (!client) return false;
    var result = await client.auth.getSession();
    return !!(result && result.data && result.data.session);
  }

  async function requireAuth() {
    var ok = await isAuthenticated();
    if (!ok) {
      window.location.href = "admin-login.html";
      return false;
    }
    return true;
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  async function bindLoginPage() {
    var form = document.getElementById("admin-login-form");
    if (!form) return;

    if (await isAuthenticated()) {
      window.location.href = "admin-dashboard.html";
      return;
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var email = String(document.getElementById("admin-email").value || "").trim();
      var password = String(document.getElementById("admin-password").value || "");
      var error = document.getElementById("admin-login-error");
      var button = form.querySelector('button[type="submit"]');

      if (!email || !password) {
        error.textContent = "Email and password are required.";
        return;
      }

      var client = getClient();
      if (!client) {
        error.textContent = "Supabase client is not available.";
        return;
      }

      error.textContent = "";
      if (button) button.disabled = true;

      var result = await client.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (button) button.disabled = false;

      if (!result.error) {
        window.location.href = "admin-dashboard.html";
        return;
      }

      error.textContent = result.error.message || "Login failed.";
    });
  }

  async function renderDashboardTable() {
    var body = document.getElementById("admin-products-body");
    if (!body) return;

    var products = [];
    try {
      products = window.getAllProducts ? await window.getAllProducts() : window.STORE_PRODUCTS || [];
    } catch (err) {
      body.innerHTML =
        '<tr><td colspan="4" class="admin-muted">Unable to load products from Supabase.</td></tr>';
      return;
    }

    body.innerHTML = "";
    if (!products.length) {
      body.innerHTML = '<tr><td colspan="4" class="admin-muted">No products found.</td></tr>';
      return;
    }

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
        escapeHtml(String(product.id)) +
        '">Edit</button>' +
        '<button class="btn" type="button" data-action="delete" data-id="' +
        escapeHtml(String(product.id)) +
        '">Delete</button>' +
        "</div></td>";
      body.appendChild(tr);
    });
  }

  async function bindDashboardPage() {
    var root = document.getElementById("admin-dashboard-page");
    if (!root) return;
    if (!(await requireAuth())) return;

    var addBtn = document.getElementById("admin-add-product");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        window.location.href = "admin-add-product.html";
      });
    }

    var table = document.getElementById("admin-products-table");
    if (table) {
      table.addEventListener("click", async function (event) {
        var target = event.target;
        if (!(target instanceof HTMLButtonElement)) return;

        var action = target.getAttribute("data-action");
        var id = target.getAttribute("data-id");
        if (!id) return;

        if (action === "delete") {
          if (typeof window.deleteProduct === "function") {
            var productToDelete = (window.STORE_PRODUCTS || []).find(function (p) {
              return String(p.id) === String(id);
            });
            if (!productToDelete) return;
            try {
              await window.deleteProduct(productToDelete);
              await renderDashboardTable();
            } catch (err) {
              window.alert("Failed to delete product.");
            }
          }
          return;
        }

        if (action === "edit") {
          var product = (window.STORE_PRODUCTS || []).find(function (p) {
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
            try {
              await window.updateProduct(product, {
                name: nextTitle,
                description: nextDescription,
                image: nextImage,
              });
              await renderDashboardTable();
            } catch (err) {
              window.alert("Failed to update product.");
            }
          }
        }
      });
    }

    await renderDashboardTable();
  }

  async function bindAddProductPage() {
    var form = document.getElementById("admin-add-form");
    if (!form) return;
    if (!(await requireAuth())) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var title = String(document.getElementById("product-title").value || "").trim();
      var description = String(document.getElementById("product-description").value || "").trim();
      var image = String(document.getElementById("product-image").value || "").trim();

      if (!title || !description || !image) return;

      if (typeof window.addProduct === "function") {
        try {
          await window.addProduct({
            name: title,
            description: description,
            image: image,
          });
        } catch (err) {
          window.alert("Failed to add product.");
          return;
        }
      }

      window.location.href = "admin-dashboard.html";
    });
  }

  bindLoginPage();
  bindDashboardPage();
  bindAddProductPage();
})();
