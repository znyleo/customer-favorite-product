import crypto from "node:crypto";

function verifyShopifyProxy(query, secret) {
  const signature = String(query.signature || "");

  if (!signature || !secret) {
    return false;
  }

  const message = Object.keys(query)
    .filter((key) => key !== "signature")
    .sort()
    .map((key) => {
      const value = Array.isArray(query[key])
        ? query[key].join(",")
        : String(query[key] ?? "");

      return `${key}=${value}`;
    })
    .join("");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expectedSignature, "utf8")
  );
}

export default async function route({ request, reply, api, logger }) {
  try {
    const query = request.query || {};

    if (!verifyShopifyProxy(query, process.env.SHOPIFY_APP_SECRET)) {
      return reply.code(401).send({
        success: false,
        error: "INVALID_SHOPIFY_PROXY_SIGNATURE",
      });
    }

    const shopDomain = String(query.shop || "");
    const customerId = String(query.logged_in_customer_id || "");
    const productId = String(query.product_id || "");
    const productHandle = String(query.product_handle || "");

    if (!customerId) {
      return reply.code(401).send({
        success: false,
        loggedIn: false,
        error: "CUSTOMER_LOGIN_REQUIRED",
      });
    }

    if (!shopDomain || !productId) {
      return reply.code(400).send({
        success: false,
        error: "MISSING_SHOP_OR_PRODUCT",
      });
    }

    const favoriteKey = `${shopDomain}:${customerId}:${productId}`;

    const existingFavorite = await api.internal.favorite.maybeFindFirst({
      filter: {
        favoriteKey: {
          equals: favoriteKey,
        },
      },
    });

    if (existingFavorite) {
      await api.internal.favorite.delete(existingFavorite.id);

      return reply.send({
        success: true,
        favorited: false,
      });
    }

    await api.internal.favorite.create({
      favoriteKey,
      shopDomain,
      customerId,
      productId,
      productHandle: productHandle || null,
    });

    return reply.send({
      success: true,
      favorited: true,
    });
  } catch (error) {
    logger.error({ error }, "Unable to update favorite");

    return reply.code(500).send({
      success: false,
      error: "UNABLE_TO_UPDATE_FAVORITE",
    });
  }
}