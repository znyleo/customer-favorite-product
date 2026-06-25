(() => {
  if (window.customerFavoritesAppLoaded) {
    return;
  }

  window.customerFavoritesAppLoaded = true;

  function initializeFavoriteButtons() {
    const blocks = document.querySelectorAll(
      "[data-customer-favorite]:not([data-favorite-initialized])"
    );

    blocks.forEach((root) => {
      root.dataset.favoriteInitialized = "true";

      const button = root.querySelector("[data-favorite-button]");

      // Signed-out visitors see the login link rendered by Liquid.
      if (!button) {
        return;
      }

      const productId = root.dataset.productId;
      const productHandle = root.dataset.productHandle || "";
      const addLabel = root.dataset.addLabel || "Add to favorites";
      const savedLabel =
        root.dataset.savedLabel || "Saved to favorites";

      const label = root.querySelector("[data-favorite-label]");
      const icon = root.querySelector("[data-favorite-icon]");
      const message = root.querySelector("[data-favorite-message]");

      function renderFavoriteState(favorited) {
        button.setAttribute("aria-pressed", String(favorited));
        button.classList.toggle("is-favorited", favorited);

        if (label) {
          label.textContent = favorited ? savedLabel : addLabel;
        }

        if (icon) {
          icon.textContent = favorited ? "♥" : "♡";
        }
      }

      function displayMessage(text) {
        if (!message) {
          return;
        }

        message.textContent = text;
        message.hidden = !text;
      }

      function buildRequestUrl() {
        const parameters = new URLSearchParams({
          product_id: productId,
          product_handle: productHandle,
        });

        return `/apps/favorites?${parameters.toString()}`;
      }

      async function sendFavoriteRequest(method) {
        const response = await fetch(buildRequestUrl(), {
          method,
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        });

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error(
            "The favorites service returned an invalid response."
          );
        }

        if (!response.ok) {
          if (data.error === "CUSTOMER_LOGIN_REQUIRED") {
            const returnUrl = encodeURIComponent(
              window.location.pathname + window.location.search
            );

            window.location.href =
              `/account/login?return_url=${returnUrl}`;

            return null;
          }

          throw new Error(
            data.error || "Unable to update favorites."
          );
        }

        return data;
      }

      async function loadFavoriteStatus() {
        button.disabled = true;

        try {
          const data = await sendFavoriteRequest("GET");

          if (data) {
            renderFavoriteState(Boolean(data.favorited));
          }
        } catch (error) {
          console.error(
            "Unable to load favorite status:",
            error
          );

          displayMessage(
            "Favorites are temporarily unavailable."
          );
        } finally {
          button.disabled = false;
        }
      }

      button.addEventListener("click", async () => {
        button.disabled = true;
        displayMessage("");

        try {
          const data = await sendFavoriteRequest("POST");

          if (data) {
            renderFavoriteState(Boolean(data.favorited));
          }
        } catch (error) {
          console.error(
            "Unable to update favorite:",
            error
          );

          displayMessage(
            "We could not update your favorites. Please try again."
          );
        } finally {
          button.disabled = false;
        }
      });

      loadFavoriteStatus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeFavoriteButtons
    );
  } else {
    initializeFavoriteButtons();
  }

  document.addEventListener(
    "shopify:section:load",
    initializeFavoriteButtons
  );
})();