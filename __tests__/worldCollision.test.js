const { Engine, Bodies } = require('matter-js');
const World = require('../src/world/World');

describe('World danger detection', () => {
    test('uses bounding overlap instead of fixed radius', () => {
        const engine = Engine.create();
        const world = new World(engine);

        const circle = Bodies.circle(100, 100, 10);
        const squareDanger = Bodies.rectangle(110, 100, 40, 40, { isSensor: true });

        // Overlapping bounds (should collide)
        expect(world.isColliding(circle, squareDanger)).toBe(true);

        // Move far away, bounds should not overlap
        circle.position.x = 500;
        circle.position.y = 500;
        circle.bounds.min.x = 490; // manually sync bounds for test
        circle.bounds.min.y = 490;
        circle.bounds.max.x = 510;
        circle.bounds.max.y = 510;
        expect(world.isColliding(circle, squareDanger)).toBe(false);
    });
});
