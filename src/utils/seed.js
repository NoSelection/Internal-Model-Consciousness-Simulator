/**
 * Deterministic RNG helper for experiments.
 * Patches Math.random with a reproducible LCG when a seed is provided.
 */
function setSeed(seed = 42) {
    // force unsigned 32-bit seed
    let state = (typeof seed === 'number'
        ? seed
        : String(seed).split('').reduce((s, ch) => (s + ch.charCodeAt(0)) >>> 0, 0)) >>> 0;

    const lcg = () => {
        // Numerical Recipes LCG parameters
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0x100000000;
    };

    // eslint-disable-next-line no-global-assign
    Math.random = lcg;
    return lcg;
}

module.exports = { setSeed };
