function loadPlugin(plugin) {
    console.log(`	Loading ${plugin}`);
    let pluginf = require(plugin);
    let shouldLoad = true;
    if (pluginf.requiresConfig && !(global.client.config[pluginf.requiresConfig] && global.client.config[pluginf.requiresConfig] !== "")) {
        shouldLoad = `it requires the config value ${pluginf.requiresConfig}`;
    }
    if (pluginf.disable) {
        shouldLoad = "it's disabled";
    }
    if (shouldLoad == true) {
        if (pluginf.events) {
            for (let event of pluginf.events) {
                console.log(`		    Connecting the '${event.name}' event`);
                if (event.name == "ready") {
                    if (global.client.readyAt) {
                        console.log("		        Firing!");
                        event.fired = true;
                        event.exec(global.client);
                    }
                } else {
                    global.client.on(event.name, event.exec);
                }
            }
        }
        if (pluginf.addons) {
            for (let addon in pluginf.addons) {
                console.log("           Adding the '" + addon + "' addon");
                global.client[addon] = pluginf.addons[addon];
            }
        }
        console.log(`		Loaded ${pluginf.name} v${pluginf.version} by ${pluginf.author}`);
        global.client.plugins.push(pluginf);
        return pluginf;
    } else {
        console.error(`		Refusing to load ${pluginf.name} v${pluginf.version} by ${pluginf.author} because ${shouldLoad}`);
    }
}

module.exports = { loadPlugin };