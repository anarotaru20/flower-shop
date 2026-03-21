function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function includesAny(text, values) {
  const normalizedText = normalizeText(text);
  return values.some((value) => normalizedText.includes(normalizeText(value)));
}

function scoreProduct(product, beneficiary) {
  let score = 0;

  const productName = normalizeText(product.name);
  const productDescription = normalizeText(product.description);
  const categoryName = normalizeText(product.categories?.name);
  const searchableText = `${productName} ${productDescription} ${categoryName}`;

  if (Number(product.stock || 0) > 0) {
    score += 20;
  } else {
    score -= 1000;
  }

  const budgetMin = beneficiary?.budget_min;
  const budgetMax = beneficiary?.budget_max;
  const price = Number(product.price || 0);

  if (budgetMin != null && budgetMax != null) {
    if (price >= Number(budgetMin) && price <= Number(budgetMax)) {
      score += 30;
    } else if (price < Number(budgetMin)) {
      score += 5;
    } else {
      score -= 15;
    }
  } else if (budgetMax != null) {
    if (price <= Number(budgetMax)) {
      score += 25;
    } else {
      score -= 15;
    }
  } else if (budgetMin != null) {
    if (price >= Number(budgetMin)) {
      score += 15;
    }
  }

  const preferredProductType = beneficiary?.preferred_product_type;
  if (preferredProductType) {
    if (includesAny(searchableText, [preferredProductType])) {
      score += 25;
    }
  }

  const preferredStyle = beneficiary?.preferred_style;
  if (preferredStyle) {
    if (includesAny(searchableText, [preferredStyle])) {
      score += 15;
    }
  }

  const preferredColors = Array.isArray(beneficiary?.preferred_colors)
    ? beneficiary.preferred_colors
    : [];

  if (preferredColors.length) {
    const matchedColors = preferredColors.filter((color) =>
      searchableText.includes(normalizeText(color)),
    ).length;

    score += matchedColors * 10;
  }

  return score;
}

function getTopRecommendedProducts(products, beneficiary, limit = 5) {
  return products
    .map((product) => ({
      ...product,
      recommendation_score: scoreProduct(product, beneficiary),
    }))
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, limit);
}

module.exports = {
  scoreProduct,
  getTopRecommendedProducts,
};