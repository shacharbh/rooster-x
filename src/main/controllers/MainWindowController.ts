import {app, BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import AbstractWindowController from "./AbstractWindowController";
import * as path from "path";
import {format as formatUrl} from "url";
import __static from "../../common/static";
const isDevelopment = process.env.NODE_ENV !== "production";

export default class MainWindowController extends AbstractWindowController {

    public windowName: string = "Main";

    protected options: BrowserWindowConstructorOptions = {
        title: "Rooster-X",
        alwaysOnTop: false,
        frame: true,
        height: 600,
        icon: path.join(__static, "assets/images/icons/icon.ico"),
        maximizable: true,
        show: true,
        skipTaskbar: false,
        transparent: false,
        width: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            // preload: Path.join(__static, "preload", "preload.js"),
        },
    };
    protected isCreated: boolean = false;

    constructor() {
        super();
    }

    // create main BrowserWindow when electron is ready
    public createWindow(options?: BrowserWindowConstructorOptions) {
        options = Object.assign({}, this.options, options);
        this.isFinishLoad = false;
        this.win = new BrowserWindow(options);
        this.win.setMenu(null);
        this.registerEvents();

        this.win.webContents.openDevTools();

        // if (isDevelopment) {
        //     this.win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/index.html`);
        // } else {
        console.log("dir", path.join(__dirname, "../../../src/renderer/index.html"));
        this.win.loadURL(formatUrl({
            pathname: path.join(__dirname, "../../../src/renderer/index.html"),
            protocol: "file",
            slashes: true,
        }));
        // }

        console.info(`Creating ${this.windowName} Window...`);
        // this.win.loadFile("../renderer/mainWindow.html");
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.error(`${this.windowName} window could not be created`);
                clearTimeout(timeout);
                clearInterval(interval);
                reject();
            }, 60000);
            const interval = setInterval(() => {
                if (this.isCreated) {
                    clearTimeout(timeout);
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    public init() {
        super.init();
        this.isCreated = true;
    }

    public onClose(e) {
        if (isDevelopment || this.forceClose) {
        // if (this.forceClose) {
             this.isCreated = false;
             this.isExist = false;
        } else {
            if (!app[isQuiting]) {
                e.preventDefault();
                this.hide();
            }
        }
    }

    public onWebFinishedLoad() {
        this.init();
    }
}

const isQuiting = "isQuiting";