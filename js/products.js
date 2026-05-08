/** Dummy catalog — shared across pages */
window.DEFAULT_STORE_PRODUCTS = [
  {
    id: "1",
    name: "Linen Throw",
    price: 48,
    blurb: "Lightweight seasonal layer for sofas and beds.",
    description:
      "Woven from European flax and garment-washed for softness. Neutral oatmeal tone fits quiet interiors. Machine wash cold, line dry.",
    image: "https://picsum.photos/seed/linen-throw/800/900",
    featured: true,
  },
  {
    id: "2",
    name: "Ceramic Mug Set",
    price: 36,
    blurb: "Stackable stoneware for morning rituals.",
    description:
      "Matte glaze exterior, glossy interior. Microwave and dishwasher safe. Set of four in mixed earth tones.",
    image: "https://picsum.photos/seed/ceramic-mugs/800/900",
    featured: true,
  },
  {
    id: "3",
    name: "Oak Cutting Board",
    price: 62,
    blurb: "End-grain surface that ages gracefully.",
    description:
      "Sustainably sourced solid oak with food-safe mineral oil finish. Juice groove along one edge. 40 × 28 cm.",
    image: "https://picsum.photos/seed/oak-board/800/900",
    featured: true,
  },
  {
    id: "4",
    name: "Wool Desk Mat",
    price: 54,
    blurb: "Felted wool pad for keyboard and mouse.",
    description:
      "Dense 3 mm felt prevents slipping and muffles desk noise. Available feel in charcoal; rounded corners.",
    image: "https://picsum.photos/seed/wool-mat/800/900",
    featured: true,
  },
  {
    id: "5",
    name: "Glass Carafe",
    price: 28,
    blurb: "Borosilicate glass for water or cold brew.",
    description:
      "Heat-resistant glass with a walnut stopper. 1 L capacity. Hand wash recommended for longevity.",
    image: "https://picsum.photos/seed/glass-carafe/800/900",
    featured: true,
  },
  {
    id: "6",
    name: "Brass Bookends",
    price: 72,
    blurb: "Solid brass pair with a soft patina.",
    description:
      "Cast brass, felt pads underneath to protect shelves. Each piece is unique due to finishing variation.",
    image: "https://picsum.photos/seed/brass-bookends/800/900",
    featured: false,
  },
  {
    id: "7",
    name: "Cotton Tote",
    price: 22,
    blurb: "Heavy canvas carryall with interior pocket.",
    description:
      "14 oz organic cotton, reinforced straps. Natural undyed base with contrast stitching.",
    image: "https://picsum.photos/seed/cotton-tote/800/900",
    featured: false,
  },
  {
    id: "8",
    name: "Beech Plant Stand",
    price: 89,
    blurb: "Tripod stand for medium planters.",
    description:
      "FSC beech hardwood, oil finish. Fits pots from 18–24 cm diameter. Indoor use.",
    image: "https://picsum.photos/seed/beech-stand/800/900",
    featured: false,
  },
];

(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nextId(products) {
    var max = products.reduce(function (acc, p) {
      var n = Number(p.id);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return String(max + 1);
  }

  window.STORE_PRODUCTS = clone(window.DEFAULT_STORE_PRODUCTS);

  window.getAllProducts = function () {
    return window.STORE_PRODUCTS;
  };

  window.addProduct = function (data) {
    var products = window.STORE_PRODUCTS;
    var newProduct = {
      id: nextId(products),
      name: data.name,
      description: data.description,
      blurb: data.description,
      image: data.image,
      price: Number(data.price) || 0,
      featured: false,
    };
    products.push(newProduct);
    return newProduct;
  };

  window.updateProduct = function (id, data) {
    var products = window.STORE_PRODUCTS;
    var index = products.findIndex(function (p) {
      return String(p.id) === String(id);
    });
    if (index === -1) return null;

    products[index] = {
      id: products[index].id,
      name: data.name,
      description: data.description,
      blurb: data.description,
      image: data.image,
      price: Number(data.price) || products[index].price || 0,
      featured: !!products[index].featured,
    };
    return products[index];
  };

  window.deleteProduct = function (id) {
    var nextProducts = window.STORE_PRODUCTS.filter(function (p) {
      return String(p.id) !== String(id);
    });
    window.STORE_PRODUCTS = nextProducts;
  };
})();
