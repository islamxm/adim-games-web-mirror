type Action = "LIMITED" | "END" | "CLOSED";
type Platform = "iOS" | "Android" | "Web";

const platformMap: Record<Platform, (action: Action) => void> = {
  iOS: (action) => {
    console.log("[iOS]: ", action);
    window.webkit?.messageHandlers[action]?.postMessage();
  },
  Android: (action) => {
    console.log("[Android]: ", action);
    window.AndroidHandler?.postMessage(action);
  },
  Web: (action) => {
    console.log("[Web]: ", action);
  },
};

export class NativeBridge {
  private get currentPlatform(): Platform {
    if ("AndroidHandler" in window) {
      return "Android";
    } else if ("webkit" in window) {
      return "iOS";
    } else {
      return "Web";
    }
  }

  private handlePlatform(action: Action) {
    const platform = this.currentPlatform;
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
