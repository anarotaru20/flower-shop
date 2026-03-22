export function isBirthdayWeek(birthDate) {
  if (!birthDate) return false

  const today = new Date()
  const birth = new Date(birthDate)

  if (Number.isNaN(birth.getTime())) return false

  const currentYear = today.getFullYear()
  const birthdayThisYear = new Date(currentYear, birth.getMonth(), birth.getDate())

  const start = new Date(birthdayThisYear)
  start.setDate(birthdayThisYear.getDate() - 3)
  start.setHours(0, 0, 0, 0)

  const end = new Date(birthdayThisYear)
  end.setDate(birthdayThisYear.getDate() + 3)
  end.setHours(23, 59, 59, 999)

  return today >= start && today <= end
}

export function getDiscountPercent(birthDate) {
  return isBirthdayWeek(birthDate) ? 10 : 0
}

export function getDiscountedPrice(price, percent) {
  if (!price || !percent) return Number(price || 0)
  return Number((price * (1 - percent / 100)).toFixed(2))
}

export function getProductPromoData(product, birthDate) {
  const discountPercent = getDiscountPercent(birthDate)
  const hasDiscount = discountPercent > 0
  const originalPrice = Number(product.price || 0)
  const finalPrice = hasDiscount
    ? getDiscountedPrice(originalPrice, discountPercent)
    : originalPrice

  return {
    ...product,
    hasPromo: hasDiscount,
    promoLabel: hasDiscount ? `Birthday Week -${discountPercent}%` : '',
    oldPrice: hasDiscount ? originalPrice : null,
    finalPrice,
    discountPercent,
  }
}