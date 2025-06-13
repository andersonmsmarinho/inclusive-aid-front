import Parse from 'parse/node';

let initialized = false;

export function getParse() {
  if (!initialized) {
    const { PARSE_APP_ID, PARSE_JS_KEY, PARSE_SERVER_URL } = process.env;
    const { PARSE_MASTER_KEY } = process.env;

    if (!PARSE_APP_ID || !PARSE_JS_KEY || !PARSE_SERVER_URL) {
      throw new Error('Variáveis de ambiente do Back4App não configuradas: PARSE_APP_ID, PARSE_JS_KEY, PARSE_SERVER_URL.');
    }

    if (PARSE_MASTER_KEY) {
      Parse.initialize(PARSE_APP_ID!, PARSE_JS_KEY!, PARSE_MASTER_KEY);
    } else {
      Parse.initialize(PARSE_APP_ID!, PARSE_JS_KEY!);
    }
    Parse.serverURL = PARSE_SERVER_URL;
    initialized = true;
  }
  return Parse;
} 