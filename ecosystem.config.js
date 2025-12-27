module.exports = {
    apps: [
        {
            name: "learn-budgam",
            script: "pnpm",
            args: "start:vps",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
