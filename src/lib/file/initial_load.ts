import { createDir, exists } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
export const initial_load = async () => {
  try {
    if (!(await exists(`${await appDataDir()}\\model`))) {
      await createDir(`${await appDataDir()}\\model`);
    }
  } catch (e) {
    console.log("Failed to create intial directory");
  }
};
