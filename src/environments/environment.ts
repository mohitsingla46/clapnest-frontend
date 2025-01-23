import packageInfo from '../../package.json';

const apiUrl = "http://localhost:5000/graphql";
const socketUrl = "http://localhost:5000";

export const environment = {
  production      : false,
  version         : packageInfo.version,
  appName         : 'ClapNest',
  envName         : 'local',
  defaultLanguage : 'en',
  apiUrl          : apiUrl,
  socketUrl       : socketUrl,
};
