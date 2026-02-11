export const formatPrice = (price: number | string) => {
    const value = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace("F\u202FCFA", "FCFA"); // Optional: adjust based on preferred display
};
