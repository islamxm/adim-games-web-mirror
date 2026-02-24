import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";

declare global {
  namespace Phaser {
    interface Scene {
      rexUI: UIPlugin;
      rexGestures: GesturesPlugin;
    }
  }
}
