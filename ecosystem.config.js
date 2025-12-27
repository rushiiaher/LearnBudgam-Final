module.exports = {
    apps: [
        {
            name: "learn-budgam",
            script: "npm",
            args: "run start:vps",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
