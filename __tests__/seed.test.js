const { setSeed } = require('../src/utils/seed');

describe('setSeed', () => {
    test('produces deterministic Math.random sequences', () => {
        setSeed(1234);
        const seq1 = [Math.random(), Math.random(), Math.random()];

        setSeed(1234);
        const seq2 = [Math.random(), Math.random(), Math.random()];

        expect(seq1).toEqual(seq2);
    });
});
