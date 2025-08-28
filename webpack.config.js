const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

module.exports = (config, options) => {
  // Load .env file
  const envPath = path.resolve(__dirname, '.env');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    const env = dotenv.config({ path: envPath }).parsed;
    
    // Create environment variables object for webpack DefinePlugin
    const envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});

    // Add the DefinePlugin to webpack plugins
    config.plugins.push(
      new webpack.DefinePlugin(envKeys)
    );
  }

  return config;
};
