module.exports = {
    apps: [
        {
            name: "Gestion de trajet cimencam",
            cwd: "../Gestion-de-trajet-cimencam",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production"
            }
        },
        {
            name: "Video Encoder",
            cwd: "../videoEncoder",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production"
            }
        },

    ]
}