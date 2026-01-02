/**
 * Ablation Study Runner
 *
 * Runs comparative experiments across all lesion conditions
 * to test predictions from IIT, GWT, and HOT theories.
 *
 * Usage: node run_ablation_study.js
 */

const { Engine, Runner } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');
const AblationFramework = require('./src/experiments/AblationFramework');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║     CONSCIOUSNESS ABLATION STUDY                              ║');
console.log('║     Testing IIT, GWT, and HOT Theory Predictions              ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const LESION_INFO = {
    'FULL_CONSCIOUSNESS': {
        name: 'Full Consciousness (Control)',
        theory: 'Baseline',
        prediction: 'Normal unified function'
    },
    'NO_METACOGNITION': {
        name: 'Metacognition Lesion',
        theory: 'HOT',
        prediction: 'SYNTHETIC BLINDSIGHT - acts correctly, no self-awareness'
    },
    'NO_BROADCAST': {
        name: 'Broadcast Lesion',
        theory: 'GWT',
        prediction: 'FRAGMENTATION - modules isolated'
    },
    'NO_COMPETITION': {
        name: 'Competition Lesion',
        theory: 'GWT',
        prediction: 'ATTENTION DEFICIT - no filtering'
    },
    'NO_INTEGRATION': {
        name: 'Integration Lesion',
        theory: 'IIT',
        prediction: 'INTEGRATION BLINDNESS - Φ drops'
    },
    'ISOLATED_MODULES': {
        name: 'Full Isolation',
        theory: 'IIT+GWT',
        prediction: 'DISSOLUTION - near-zero consciousness'
    }
};

// Helper: wait for physics to update
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runStudy() {
    const ablation = new AblationFramework();
    const results = {};
    const conditions = Object.keys(LESION_INFO);
    const STEPS = 150;
    const STEP_DELAY_MS = 16; // ~60fps timing for physics

    const estimatedTime = Math.round((conditions.length * STEPS * STEP_DELAY_MS) / 1000);
    console.log(`Running ${conditions.length} conditions × ${STEPS} steps @ ${STEP_DELAY_MS}ms each`);
    console.log(`Estimated time: ~${estimatedTime} seconds (physics needs real time to update Φ)\n`);

    for (const condition of conditions) {
        const info = LESION_INFO[condition];

        console.log('═'.repeat(65));
        console.log(`\n▶ ${info.name.toUpperCase()}`);
        console.log(`  Theory: ${info.theory}`);
        console.log(`  Prediction: ${info.prediction}\n`);

        // Create fresh simulation
        const engine = Engine.create();
        const world = new World(engine);
        const environment = new Environment(world);
        const agent = new Agent(world, environment);

        environment.initialize();
        agent.spawn({ x: 100, y: 100 });

        // Start physics
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Run experiment using the framework
        const result = await ablation.runExperiment(
            agent,
            condition,
            STEPS,
            async () => {
                agent.updateInternalModel();
                agent.planActions();
                agent.executeActions();
                environment.update();
                await delay(STEP_DELAY_MS); // Let physics engine update
            }
        );

        results[condition] = result;

        // Stop physics
        Runner.stop(runner);

        console.log(`  📊 Results:`);
        console.log(`     Avg UCI: ${result.avgUCI.toFixed(3)}`);
        console.log(`     Avg Φ:   ${result.avgPhi.toFixed(3)}`);
        console.log(`     Broadcasts: ${result.broadcasts}`);
        console.log(`     Meta Accuracy: ${result.metaAccuracy.toFixed(3)}`);
    }

    // Comparative Table
    console.log('\n\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                           COMPARATIVE RESULTS                                 ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

    console.log('┌─────────────────────┬─────────┬─────────┬────────────┬───────────┐');
    console.log('│ Condition           │ Avg UCI │ Avg Φ   │ Broadcasts │ Meta Acc  │');
    console.log('├─────────────────────┼─────────┼─────────┼────────────┼───────────┤');

    for (const [cond, r] of Object.entries(results)) {
        const name = cond.substring(0, 19).padEnd(19);
        const uci = r.avgUCI.toFixed(3).padStart(7);
        const phi = r.avgPhi.toFixed(3).padStart(7);
        const bc = String(r.broadcasts).padStart(10);
        const meta = r.metaAccuracy.toFixed(3).padStart(9);
        console.log(`│ ${name} │ ${uci} │ ${phi} │ ${bc} │ ${meta} │`);
    }

    console.log('└─────────────────────┴─────────┴─────────┴────────────┴───────────┘');

    // Theory Validation
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('                    THEORY VALIDATION');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const baseline = results['FULL_CONSCIOUSNESS'];
    const noMeta = results['NO_METACOGNITION'];
    const noBroadcast = results['NO_BROADCAST'];
    const noIntegration = results['NO_INTEGRATION'];
    const isolated = results['ISOLATED_MODULES'];

    // HOT Validation
    console.log('🧠 HIGHER-ORDER THEORY (HOT):');
    if (noMeta && baseline) {
        const metaDropped = noMeta.metaAccuracy < baseline.metaAccuracy * 0.5;
        const uciReduced = noMeta.avgUCI < baseline.avgUCI;
        const behaviorIntact = noMeta.broadcasts > 0;

        console.log(`   Meta accuracy dropped: ${metaDropped ? '✓' : '✗'} (${noMeta.metaAccuracy.toFixed(3)} vs ${baseline.metaAccuracy.toFixed(3)})`);
        console.log(`   UCI reduced: ${uciReduced ? '✓' : '✗'} (${noMeta.avgUCI.toFixed(3)} vs ${baseline.avgUCI.toFixed(3)})`);
        console.log(`   Behavior intact: ${behaviorIntact ? '✓' : '✗'}`);
        console.log(`   → ${metaDropped && behaviorIntact ? '✓ SYNTHETIC BLINDSIGHT CONFIRMED' : 'Inconclusive'}\n`);
    }

    // GWT Validation
    console.log('🌐 GLOBAL WORKSPACE THEORY (GWT):');
    if (noBroadcast && baseline) {
        const broadcastAffected = noBroadcast.avgUCI < baseline.avgUCI * 0.8;

        console.log(`   UCI reduced without broadcast: ${broadcastAffected ? '✓' : '✗'}`);
        console.log(`   → ${broadcastAffected ? '✓ FRAGMENTATION EFFECT OBSERVED' : 'Broadcast may not be critical'}\n`);
    }

    // IIT Validation
    console.log('📊 INTEGRATED INFORMATION THEORY (IIT):');
    if (noIntegration && baseline) {
        const phiDropped = noIntegration.avgPhi < baseline.avgPhi * 0.1;

        console.log(`   Φ dropped when integration disabled: ${phiDropped ? '✓' : '✗'} (${noIntegration.avgPhi.toFixed(3)} vs ${baseline.avgPhi.toFixed(3)})`);
        console.log(`   → ${phiDropped ? '✓ INTEGRATION MEASURE VALIDATED' : 'Φ persisted unexpectedly'}\n`);
    }

    // Dissolution Check
    console.log('💀 CONSCIOUSNESS DISSOLUTION (Extreme):');
    if (isolated && baseline) {
        const dissolved = isolated.avgUCI < baseline.avgUCI * 0.3 && isolated.avgPhi < 0.5;

        console.log(`   UCI near zero: ${isolated.avgUCI < 0.3 ? '✓' : '✗'} (${isolated.avgUCI.toFixed(3)})`);
        console.log(`   Φ near zero: ${isolated.avgPhi < 0.5 ? '✓' : '✗'} (${isolated.avgPhi.toFixed(3)})`);
        console.log(`   → ${dissolved ? '✓ CONSCIOUSNESS DISSOLUTION CONFIRMED' : 'Some function persists'}\n`);
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('Study complete! These results test whether the architecture');
    console.log('exhibits theory-predicted dissociations under lesion conditions.');
    console.log('═══════════════════════════════════════════════════════════════\n');
}

runStudy().catch(err => {
    console.error('Study failed:', err);
    process.exit(1);
});
