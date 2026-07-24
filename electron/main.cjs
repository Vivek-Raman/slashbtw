const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("node:path");

const AI_SETTINGS_DEFAULTS = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "",
};

let store;

const normalizeSettings = (settings) => ({
  baseUrl: typeof settings?.baseUrl === "string" ? settings.baseUrl.trim() : "",
  apiKey: typeof settings?.apiKey === "string" ? settings.apiKey.trim() : "",
  model: typeof settings?.model === "string" ? settings.model.trim() : "",
});

const registerIpcHandlers = () => {
  ipcMain.handle("settings:ai:get", () => store.get("ai"));

  ipcMain.handle("settings:ai:set", (_event, settings) => {
    const normalizedSettings = normalizeSettings(settings);
    store.set("ai", normalizedSettings);
    return normalizedSettings;
  });
};

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 720,
    minHeight: 480,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    void window.loadURL(devServerUrl);
  } else {
    void window.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};

app.whenReady().then(async () => {
  const { default: Store } = await import("electron-store");

  store = new Store({
    name: "settings",
    defaults: {
      ai: AI_SETTINGS_DEFAULTS,
    },
    schema: {
      ai: {
        type: "object",
        properties: {
          baseUrl: { type: "string" },
          apiKey: { type: "string" },
          model: { type: "string" },
        },
        required: ["baseUrl", "apiKey", "model"],
        additionalProperties: false,
      },
    },
  });

  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
