"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configPath = "../config/config.js";
const config = require(configPath);
if (!config.defaultPrefix || !config.token || !config.maintainers)
    throw new Error("Config is missing one of the required keys. Ensure that 'token', 'maintainers' and 'defaultPrefix' are present.");
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDO0FBQ3pDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQW1CLENBQUM7QUFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7SUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlIQUFpSCxDQUFDLENBQUM7QUFFdE0sa0JBQWUsTUFBTSxDQUFDIn0=