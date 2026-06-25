import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "favorite" model, go to https://customer-favorites-app.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "uaR-Y99Wpa5R",
  comment:
    "Model storing a single product favorite per storefront customer. Each record ties a customer to a product within a specific Shopify shop and records when the favorite was added. Used as the source of truth for customer favorites.",
  fields: {
    customerId: {
      type: "string",
      validations: { required: true },
      storageKey: "iIB8d0y5Ai2E",
      searchIndex: false,
    },
    favoriteKey: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey: "MH8jrlNr6eeZ",
    },
    productHandle: { type: "string", storageKey: "EptQnuVK4ovS" },
    productId: {
      type: "string",
      validations: { required: true },
      storageKey: "GnCSA5xYMye3",
      searchIndex: false,
    },
    shopDomain: {
      type: "string",
      validations: { required: true },
      storageKey: "n3zsEoNZSFrm",
      searchIndex: false,
    },
  },
};
