export const EXPONENTIAL_SMOOTHING_WEIGHT = 0.025; // Gamma

const smooth = (alpha: number, beta: number, gamma: number): number => {
    return alpha + gamma * (beta - alpha);
};

const getGammaForUniformSmoothing = (size: number): number => {
    return 1 / size;
};

const getNewMean = (
    oldMean: number,
    value: number,
    weight = EXPONENTIAL_SMOOTHING_WEIGHT,
): number => {
    return smooth(oldMean, value, weight);
};

const getNewVariance = (
    oldVariance: number,
    oldMean: number,
    newMean: number,
    value: number,
    weight = EXPONENTIAL_SMOOTHING_WEIGHT,
): number => {
    return smooth(oldVariance, (value - oldMean) * (value - newMean), weight);
};

const getAlphaAndBeta = (
    mean: number,
    variance: number,
    size: number,
): {
    alpha: number;
    beta: number;
} => {
    if (size === 1) {
        return {
            alpha: 1,
            beta: 1,
        };
    }

    const alpha = mean * ((mean * (1 - mean)) / variance - 1);
    const beta = (1 - mean) * ((mean * (1 - mean)) / variance - 1);
    return { alpha, beta };
};

export const BetaDistributionService = {
    getGammaForUniformSmoothing,
    getNewMean,
    getNewVariance,
    getAlphaAndBeta,
};
