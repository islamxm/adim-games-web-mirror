type Action = "LIMITED" | "END" | "CLOSED";
type Platform = "iOS" | "Android" | "Web";

const platformMap: Record<Platform, (action: Action) => void> = {
  iOS: (action) => {
    if (!("webkit" in window)) {
      console.log(
        "%cERROR%c %c[Web App]%c Обьект для обмена сообщениями с %ciOS - webkit%c не найден в глобальном обьекте",
        "background: red; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
        "color: inherit; background: inherit;",
        "background: black; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
        "color: inherit; background: inherit;",
        "text-decoration: underline; font-weight: bold;",
        "color: inherit; background: inherit; text-decoration: none;",
      );
      return;
    }
    window.webkit?.messageHandlers[action]?.postMessage("");
  },
  Android: (action) => {
    if (!("AndroidHandler" in window)) {
      console.log(
        "%cERROR%c %c[Web App]%c Обьект для обмена сообщениями с %cAndroid - AndroidHandler%c не найден в глобальном обьекте",
        "background: red; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
        "color: inherit; background: inherit;",
        "background: black; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
        "color: inherit; background: inherit;",
        "text-decoration: underline; font-weight: bold;",
        "color: inherit; background: inherit; text-decoration: none;",
      );
      return;
    }
    window.AndroidHandler?.postMessage(action);
  },
  Web: () => {
    console.log(
      "%cWARNING%c Пожалуйста используйте мобильное приложение Ädim",
      "background: orange; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
      "color: inherit; background: inherit;",
    );
  },
};

export class NativeBridge {
  private get platform(): Platform {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const platformName = urlParams.get("platform") as Platform;

    console.log("QUERY STRING: ", queryString);
    console.log("PLATFORM QUERY: ", platformName);

    return platformName;
  }

  private handlePlatform(action: Action) {
    const platform = this.platform;
    platformMap[platform](action);
  }

  close() {
    this.handlePlatform("CLOSED");
  }

  limit() {
    this.handlePlatform("LIMITED");
  }

  end() {
    this.handlePlatform("END");
  }
}
