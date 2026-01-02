/**
 * Ablation Study Runner
 *
 * Runs comparative experiments across all lesion conditions
 * to test predictions from IIT, GWT, and HOT theories.
 *
 * Usage: node run_ablation_study.js
 */

const { Engine, Runner } = require('matter-js');
const { setSeed } = require('./src/utils/seed');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');
const AblationFramework = require('./src/experiments/AblationFramework');
const ChartExporter = require('./src/visualization/ChartExporter');

// Deterministic runs for research reproducibility
setSeed(process.env.SEED ? Number(process.env.SEED) : 42);

console.log('================================================================');
console.log('  CONSCIOUSNESS ABLATION STUDY');
console.log('  Testing IIT, GWT, and HOT Theory Predictions');
console.log('================================================================\n');

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
        prediction: 'INTEGRATION BLINDNESS - Phi drops'
    },
    'ISOLATED_MODULES': {
        name: 'Full Isolation',
        theory: 'IIT+GWT',
        prediction: 'DISSOLUTION - near-zero consciousness'
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runStudy() {
    const ablation = new AblationFramework();
    const results = {};
    const conditions = Object.keys(LESION_INFO);
    const STEPS = 150;
    const STEP_DELAY_MS = 16;

    const estimatedTime = Math.round((conditions.length * STEPS * STEP_DELAY_MS) / 1000);
    console.log(`Running ${conditions.length} conditions x ${STEPS} steps @ ${STEP_DELAY_MS}ms each`);
    console.log(`Estimated time: ~${estimatedTime} seconds\n`);

    for (const condition of conditions) {
        const info = LESION_INFO[condition];

        console.log('----------------------------------------------------------------');
        console.log(`[CONDITION] ${info.name.toUpperCase()}`);
        console.log(`  Theory: ${info.theory}`);
        console.log(`  Prediction: ${info.prediction}\n`);

        const engine = Engine.create();
        const world = new World(engine);
        const environment = new Environment(world);
        const agent = new Agent(world, environment);

        environment.initialize();
        agent.spawn({ x: 100, y: 100 });

        const runner = Runner.create();
        Runner.run(runner, engine);

        const result = await ablation.runExperiment(
            agent,
            condition,
            STEPS,
            async () => {
                agent.updateInternalModel();
                agent.planActions();
                agent.executeActions();
                environment.update();
                await delay(STEP_DELAY_MS);
            }
        );

        results[condition] = result;

        Runner.stop(runner);

        console.log(`  Results:`);
        console.log(`    Avg UCI: ${result.avgUCI.toFixed(3)}`);
        console.log(`    Avg Phi: ${result.avgPhi.toFixed(3)}`);
        console.log(`    Broadcasts: ${result.broadcasts}`);
        console.log(`    Meta Accuracy: ${result.metaAccuracy.toFixed(3)}\n`);
    }

    // Comparative Table
    console.log('\n================================================================');
    console.log('  COMPARATIVE RESULTS');
    console.log('================================================================\n');

    console.log('+---------------------+---------+---------+------------+-----------+');
    console.log('| Condition           | Avg UCI | Avg Phi | Broadcasts | Meta Acc  |');
    console.log('+---------------------+---------+---------+------------+-----------+');

    for (const [cond, r] of Object.entries(results)) {
        const name = cond.substring(0, 19).padEnd(19);
        const uci = r.avgUCI.toFixed(3).padStart(7);
        const phi = r.avgPhi.toFixed(3).padStart(7);
        const bc = String(r.broadcasts).padStart(10);
        const meta = r.metaAccuracy.toFixed(3).padStart(9);
        console.log(`| ${name} | ${uci} | ${phi} | ${bc} | ${meta} |`);
    }

    console.log('+---------------------+---------+---------+------------+-----------+');

    // Theory Validation
    console.log('\n================================================================');
    console.log('  THEORY VALIDATION');
    console.log('================================================================\n');

    const baseline = results['FULL_CONSCIOUSNESS'];
    const noMeta = results['NO_METACOGNITION'];
    const noBroadcast = results['NO_BROADCAST'];
    const noIntegration = results['NO_INTEGRATION'];
    const isolated = results['ISOLATED_MODULES'];

    // HOT Validation
    console.log('HIGHER-ORDER THEORY (HOT):');
    if (noMeta && baseline) {
        const metaDropped = noMeta.metaAccuracy < baseline.metaAccuracy * 0.5;
        const uciReduced = noMeta.avgUCI < baseline.avgUCI;
        const behaviorIntact = noMeta.broadcasts > 0;

        console.log(`  Meta accuracy dropped: ${metaDropped ? 'YES' : 'NO'} (${noMeta.metaAccuracy.toFixed(3)} vs ${baseline.metaAccuracy.toFixed(3)})`);
        console.log(`  UCI reduced: ${uciReduced ? 'YES' : 'NO'} (${noMeta.avgUCI.toFixed(3)} vs ${baseline.avgUCI.toFixed(3)})`);
        console.log(`  Behavior intact: ${behaviorIntact ? 'YES' : 'NO'}`);
        console.log(`  -> ${metaDropped && behaviorIntact ? 'SYNTHETIC BLINDSIGHT CONFIRMED' : 'Inconclusive'}\n`);
    }

    // GWT Validation
    console.log('GLOBAL WORKSPACE THEORY (GWT):');
    if (noBroadcast && baseline) {
        const broadcastAffected = noBroadcast.avgUCI < baseline.avgUCI * 0.8;

        console.log(`  UCI reduced without broadcast: ${broadcastAffected ? 'YES' : 'NO'}`);
        console.log(`  -> ${broadcastAffected ? 'FRAGMENTATION EFFECT OBSERVED' : 'Broadcast may not be critical'}\n`);
    }

    // IIT Validation
    console.log('INTEGRATED INFORMATION THEORY (IIT):');
    if (noIntegration && baseline) {
        const phiDropped = noIntegration.avgPhi < baseline.avgPhi * 0.1;

        console.log(`  Phi dropped when integration disabled: ${phiDropped ? 'YES' : 'NO'} (${noIntegration.avgPhi.toFixed(3)} vs ${baseline.avgPhi.toFixed(3)})`);
        console.log(`  -> ${phiDropped ? 'INTEGRATION MEASURE VALIDATED' : 'Phi persisted unexpectedly'}\n`);
    }

    // Dissolution Check
    console.log('CONSCIOUSNESS DISSOLUTION (Extreme):');
    if (isolated && baseline) {
        const dissolved = isolated.avgUCI < baseline.avgUCI * 0.3 && isolated.avgPhi < 0.5;

        console.log(`  UCI near zero: ${isolated.avgUCI < 0.3 ? 'YES' : 'NO'} (${isolated.avgUCI.toFixed(3)})`);
        console.log(`  Phi near zero: ${isolated.avgPhi < 0.5 ? 'YES' : 'NO'} (${isolated.avgPhi.toFixed(3)})`);
        console.log(`  -> ${dissolved ? 'CONSCIOUSNESS DISSOLUTION CONFIRMED' : 'Some function persists'}\n`);
    }

    console.log('================================================================');
    console.log('Study complete. Results test whether the architecture');
    console.log('exhibits theory-predicted dissociations under lesion conditions.');
    console.log('================================================================\n');

    // Export chart
    const exporter = new ChartExporter('./results');
    exporter.exportAblationStudy(results);
}

runStudy().catch(err => {
    console.error('Study failed:', err);
    process.exit(1);
});
