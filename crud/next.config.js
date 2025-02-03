module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false, // 忽略 fs 依赖
            };
        }
        return config;
    },
};
