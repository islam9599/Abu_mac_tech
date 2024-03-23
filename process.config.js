module.exports = {
  apps: [
    {
      name: "Abu_Mac_Tech",
      cwd: "./",
      watch: "true",
      script: "./server.js",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      instances: 2,
      exec_mode: "cluster",
    },
  ],
};
