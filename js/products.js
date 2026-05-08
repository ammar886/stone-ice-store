/** Supabase product API wrapper */
(function () {
  window.STORE_PRODUCTS = [];

  function getClient() {
    return window.supabaseClient || null;
  }

  function normalizeProduct(row, index) {
    return {
      id: row.id != null ? row.id : row.product_name + "-" + index,
      name: row.product_name || "",
      description: row.product_description || "",
      image: row.product_thumbnail || "",
      dbName: row.product_name || "",
      dbDescription: row.product_description || "",
      dbThumbnail: row.product_thumbnail || "",
    };
  }

  async function refreshProducts() {
    var client = getClient();
    if (!client) throw new Error("Supabase client is not available.");

    var result = await client
      .from("product")
      .select("*")
      .order("product_name", { ascending: true });

    if (result.error) throw result.error;

    window.STORE_PRODUCTS = (result.data || []).map(function (row, index) {
      return normalizeProduct(row, index);
    });
    return window.STORE_PRODUCTS;
  };

  window.getAllProducts = async function () {
    return refreshProducts();
  };

  window.addProduct = async function (data) {
    var client = getClient();
    if (!client) throw new Error("Supabase client is not available.");

    var result = await client.from("products").insert({
      product_title: data.name,
      product_description: data.description,
      product_thumbnail: data.image,
    });

    if (result.error) throw result.error;
    return refreshProducts();
  };

  function applyRowFilter(query, product) {
    if (product && product.id != null && !String(product.id).includes("-")) {
      return query.eq("id", product.id);
    }
    return query
      .eq("product_name", product.dbName)
      .eq("product_description", product.dbDescription)
      .eq("product_thumbnail", product.dbThumbnail);
  }

  window.updateProduct = async function (product, data) {
    var client = getClient();
    if (!client) throw new Error("Supabase client is not available.");

    var query = client
      .from("product")
      .update({
        product_name: data.name,
        product_description: data.description,
        product_thumbnail: data.image,
      });
    var result = await applyRowFilter(query, product);

    if (result.error) throw result.error;
    return refreshProducts();
  };

  window.deleteProduct = async function (product) {
    var client = getClient();
    if (!client) throw new Error("Supabase client is not available.");

    var query = client.from("product").delete();
    var result = await applyRowFilter(query, product);
    if (result.error) throw result.error;
    return refreshProducts();
  };
})();
