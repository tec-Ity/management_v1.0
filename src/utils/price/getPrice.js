const getPrice = (priceIn, digits = 2, symbol = "€") => {
  try {
    const price = parseFloat(priceIn);
    if (isNaN(price)) throw new Error("price is not a number");
    if (price >= 0)
      return symbol + String(price.toFixed(digits || 2)).replace(".", ",");
    else
      return (
        "- " +
        symbol +
        String((0 - price).toFixed(digits || 2)).replace(".", ",")
      );
  } catch (err) {
    // console.log(err);
    return 0;
  }
};

export default getPrice;
