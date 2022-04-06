import dotenv from "dotenv";
import path from "path";
import Joi from "@hapi/joi";

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}


export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  search_api_url: `http://ws.audioscrobbler.com/2.0/?method=artist.search&api_key=${envVars.ARTIST_API_KEY}&format=json`
};
