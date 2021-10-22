const { Plugin } = require('powercord/entities');
const { shell: { openPath } } = require('electron')
const Settings = require("./components/settings.jsx");
module.exports = class Open extends Plugin {
    startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'open',
            aliases: ['l'],
            description: 'Opens a file',
            usage: '{c} [path]',
            executor: this.openFolder.bind(this)
        });
        powercord.api.settings.registerSettings("openfolder", {
            category: this.entityID,
            label: "Open Folder",
            render: Settings
        });
        
    };
    _ensureSetting(name, defaultValue) {
        this.settings.set(name, this.settings.get(name, defaultValue));
    }
    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('open');
    };
    getWindowType() {
        if (window.Astra) {
            return Astra.path
        } else if (window.powercord) {
            return powercord.basePath
          }
    }
    async openFolder(args) {
        if((args == "bd") && !window.BdApi) {
            return {
                send: false,
                result: "BetterDiscord plugins folder not found! Are you sure bdCompat is installed/enabled?"
            }
        }
        if((args == "as") && !window.Astra) {
            return {
                send: false,
                result: "Astra's plugin folder can't be found, Poser! <:FA_FoxxoUwUSmug:857805774940274708>"
            }
        }
        let path = args.toString()
        
        if (args == "") {
            openPath(powercord.basePath.replace(String.fromCharCode(92),String.fromCharCode(47)))
        } else if ((args == "bd") && window.BdApi) {
            openPath(BdApi.Plugins.folder)
        } else if (args == "pc") {
            openPath(powercord.pluginManager.pluginDir)
        } else if ((args == "as") && window.Astra) {
            openPath(Astra.plugins.getManager('Astra').path)
        }else {
            let escapedPath = path.replace(',', '\ ') // powercord commands replace spaces with commas, this replaces the comma with a space for paths that have spaces
            openPath(escapedPath.replace(String.fromCharCode(92),String.fromCharCode(47)))
        }
    }
}
