import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

declare global {
  namespace Phaser {
    interface Scene {
      rexUI: UIPlugin;
    }
  }
}
