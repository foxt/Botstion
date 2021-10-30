

interface BotstionConfig {
    token: string;
    defaultPrefix: string;
    maintainers: string[];
}

const configPath = "../config/config.js";
const config = require(configPath) as BotstionConfig;
if (!config.defaultPrefix || !config.token || !config.maintainers) throw new Error("Config is missing one of the required keys. Ensure that 'token', 'maintainers' and 'defaultPrefix' are present.");

export default config;