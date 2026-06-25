import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://customer-favorites-app.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        favorite: {
          read: true,
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        session: {
          read: true,
        },
        shopifyApp: {
          read: true,
        },
        shopifyAppInstallation: {
          read: true,
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyFile: {
          read: true,
        },
        shopifyGdprRequest: {
          read: true,
          actions: {
            create: true,
            update: true,
          },
        },
        shopifyProduct: {
          read: true,
        },
        shopifyProductMedia: {
          read: true,
        },
        shopifyProductOption: {
          read: true,
        },
        shopifyProductVariant: {
          read: true,
        },
        shopifyProductVariantMedia: {
          read: true,
        },
        shopifyShop: {
          read: true,
          actions: {
            install: true,
            reinstall: true,
            uninstall: true,
            update: true,
          },
        },
        shopifySync: {
          read: true,
          actions: {
            abort: true,
            complete: true,
            error: true,
            run: true,
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
    },
  },
};
