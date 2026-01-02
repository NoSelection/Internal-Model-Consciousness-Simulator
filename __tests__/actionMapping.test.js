const QLearning = require('../src/agent/QLearning');
const Agent = require('../src/agent/Agent');
const World = require('../src/world/World');
const Environment = require('../src/environment/Environment');
const { Engine } = require('matter-js');

describe('action mapping', () => {
    test('QLearning exposes distinct actions including block and wait', () => {
        const ql = new QLearning();
        const types = ql.actions.map(a => a.type + (a.direction ? `_${a.direction}` : ''));
        expect(new Set(types).size).toBe(ql.actions.length);
        expect(types).toContain('block_stay');
        expect(types).toContain('wait');
    });

    test('Agent mapping preserves unique indices', () => {
        const engine = Engine.create();
        const world = new World(engine);
        const env = new Environment(world);
        const agent = new Agent(world, env);

        const actions = [
            { type: 'move', direction: 'north' },
            { type: 'move', direction: 'south' },
            { type: 'move', direction: 'east' },
            { type: 'move', direction: 'west' },
            { type: 'block' },
            { type: 'wait' }
        ];

        const indices = actions.map(a => agent.mapActionToIndex(a));
        expect(new Set(indices).size).toBe(actions.length);

        actions.forEach((action, idx) => {
            expect(agent.convertIndexToAction(indices[idx])).toMatchObject(action);
        });
    });
});
