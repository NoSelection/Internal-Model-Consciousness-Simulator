const IntegrationMeasure = require('../src/consciousness/IntegrationMeasure');

describe('IntegrationMeasure.simplifyState', () => {
    test('is invariant to object key order', () => {
        const measure = new IntegrationMeasure();
        const a = { x: 1, y: 2, nested: { b: 1, a: 2 } };
        const b = { y: 2, x: 1, nested: { a: 2, b: 1 } };

        const hashA = measure.simplifyState(a);
        const hashB = measure.simplifyState(b);

        expect(hashA).toBe(hashB);
    });
});
