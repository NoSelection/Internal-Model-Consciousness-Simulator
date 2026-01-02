/**
 * Consciousness States Experiment
 *
 * Comparative Study: Wake vs Meditation vs REM Dream
 *
 * Tests the hypothesis: "Dreaming = Meditation without Metacognition"
 *
 * Expected Results:
 * - WAKE: Baseline consciousness with external input
 * - MEDITATION: Hyper-coherence (High UCI, High Meta, Stable Phi)
 * - REM_DREAM: Racing mind pattern (High Phi, Low Meta)
 *
 * Usage: node run_consciousness_states.js
 */

const { Engine, Runner } = require('matter-js');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');
const DreamCycle = require('./src/consciousness/DreamCycle');
const ChartExporter = require('./src/visualization/ChartExporter');

console.log('================================================================');
console.log('  CONSCIOUSNESS STATES: Comparative Study');
console.log('  Wake vs Meditation vs REM Dreaming');
console.log('================================================================\n');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function collectMetrics(agent, steps, stepFn, stepDelay) {
    const metrics = [];

    for (let step = 0; step < steps; step++) {
        await stepFn();

        if (step % 10 === 0) {
            const status = agent.getStatus();
            const cons = status.consciousness;
            metrics.push({
                step,
                uci: parseFloat(cons.UCI),
                phi: parseFloat(cons.layers.L1_Integration.phi),
                meta: parseFloat(cons.layers.L3_MetaCognition.accuracy),
                broadcasts: cons.layers.L2_GlobalWorkspace.broadcasts
            });
        }

        await delay(stepDelay);
    }

    return metrics;
}

function calculateAverages(metrics) {
    if (metrics.length === 0) return { uci: 0, phi: 0, meta: 0 };
    return {
        uci: metrics.reduce((s, m) => s + m.uci, 0) / metrics.length,
        phi: metrics.reduce((s, m) => s + m.phi, 0) / metrics.length,
        meta: metrics.reduce((s, m) => s + m.meta, 0) / metrics.length
    };
}

async function runExperiment() {
    const STEPS_PER_STATE = 100;
    const STEP_DELAY = 16;

    console.log(`Protocol: ${STEPS_PER_STATE} steps per state @ ${STEP_DELAY}ms\n`);

    const engine = Engine.create();
    const world = new World(engine);
    const environment = new Environment(world);
    const agent = new Agent(world, environment);

    environment.initialize();
    agent.spawn({ x: 100, y: 100 });

    const dreamCycle = new DreamCycle(agent);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const results = {};

    // STATE 1: WAKE
    console.log('----------------------------------------------------------------');
    console.log('[STATE 1] WAKE - External Input Active\n');

    const wakeMetrics = await collectMetrics(agent, STEPS_PER_STATE, async () => {
        agent.updateInternalModel();
        agent.planActions();
        agent.executeActions();
        environment.update();
    }, STEP_DELAY);

    results.WAKE = calculateAverages(wakeMetrics);
    console.log(`  Wake: UCI=${results.WAKE.uci.toFixed(3)}, Phi=${results.WAKE.phi.toFixed(3)}, Meta=${results.WAKE.meta.toFixed(3)}\n`);

    // STATE 2: MEDITATION
    console.log('----------------------------------------------------------------');
    console.log('[STATE 2] MEDITATION - Sensory Gated, Meta Intact\n');

    dreamCycle.sleep(DreamCycle.MODES.MEDITATION);

    const meditationMetrics = await collectMetrics(agent, STEPS_PER_STATE, async () => {
        dreamCycle.dreamStep();
    }, STEP_DELAY);

    const meditationAnalysis = dreamCycle.wake();
    results.MEDITATION = calculateAverages(meditationMetrics);
    console.log(`  Meditation: UCI=${results.MEDITATION.uci.toFixed(3)}, Phi=${results.MEDITATION.phi.toFixed(3)}, Meta=${results.MEDITATION.meta.toFixed(3)}\n`);

    await delay(500);

    // STATE 3: REM DREAM
    console.log('----------------------------------------------------------------');
    console.log('[STATE 3] REM DREAM - Sensory Gated, Meta Dampened\n');

    dreamCycle.sleep(DreamCycle.MODES.REM_DREAM);

    const remMetrics = await collectMetrics(agent, STEPS_PER_STATE, async () => {
        dreamCycle.dreamStep();
    }, STEP_DELAY);

    const remAnalysis = dreamCycle.wake();
    results.REM_DREAM = calculateAverages(remMetrics);
    results.REM_DREAM.bizarreEvents = dreamCycle.dreamState.bizarreEvents;
    console.log(`  REM Dream: UCI=${results.REM_DREAM.uci.toFixed(3)}, Phi=${results.REM_DREAM.phi.toFixed(3)}, Meta=${results.REM_DREAM.meta.toFixed(3)}`);
    console.log(`  Bizarre events: ${results.REM_DREAM.bizarreEvents}\n`);

    Runner.stop(runner);

    // RESULTS TABLE
    console.log('\n================================================================');
    console.log('  CONSCIOUSNESS STATES COMPARISON');
    console.log('================================================================\n');

    console.log('+--------------+---------+---------+-----------+---------------------------+');
    console.log('| State        | Avg UCI | Avg Phi | Avg Meta  | Interpretation            |');
    console.log('+--------------+---------+---------+-----------+---------------------------+');

    const states = ['WAKE', 'MEDITATION', 'REM_DREAM'];
    const interpretations = {
        WAKE: 'Normal consciousness',
        MEDITATION: 'Hyper-coherence / Flow',
        REM_DREAM: 'Dreaming / Racing mind'
    };

    for (const state of states) {
        const r = results[state];
        const name = state.padEnd(12);
        const uci = r.uci.toFixed(3).padStart(7);
        const phi = r.phi.toFixed(3).padStart(7);
        const meta = r.meta.toFixed(3).padStart(9);
        const interp = interpretations[state].padEnd(25);
        console.log(`| ${name} | ${uci} | ${phi} | ${meta} | ${interp} |`);
    }

    console.log('+--------------+---------+---------+-----------+---------------------------+');

    // HYPOTHESIS TESTING
    console.log('\n================================================================');
    console.log('  HYPOTHESIS TESTING');
    console.log('================================================================\n');

    // Test 1
    console.log('TEST 1: Does meditation increase coherence?');
    const meditationMoreCoherent = results.MEDITATION.uci > results.WAKE.uci;
    console.log(`  Meditation UCI (${results.MEDITATION.uci.toFixed(3)}) > Wake UCI (${results.WAKE.uci.toFixed(3)}): ${meditationMoreCoherent ? 'YES' : 'NO'}`);
    if (meditationMoreCoherent) {
        console.log('  -> CONFIRMED: Sensory reduction + intact meta = hyper-coherence\n');
    }

    // Test 2
    console.log('TEST 2: Does REM show "racing mind" pattern?');
    const remLowerMeta = results.REM_DREAM.meta < results.MEDITATION.meta * 0.7;
    const remHighPhi = results.REM_DREAM.phi > results.WAKE.phi * 0.5;
    console.log(`  REM Meta (${results.REM_DREAM.meta.toFixed(3)}) < Meditation Meta (${results.MEDITATION.meta.toFixed(3)}): ${remLowerMeta ? 'YES' : 'NO'}`);
    console.log(`  REM Phi (${results.REM_DREAM.phi.toFixed(3)}) maintained: ${remHighPhi ? 'YES' : 'NO'}`);
    if (remLowerMeta && remHighPhi) {
        console.log('  -> CONFIRMED: "RACING MIND" - High activity, low self-awareness\n');
    } else if (remLowerMeta) {
        console.log('  -> PARTIAL: Meta dropped but Phi pattern unclear\n');
    }

    // Test 3
    console.log('TEST 3: Does REM resemble the NO_METACOGNITION ablation?');
    console.log('  (Ablation showed: behavior intact, meta = 0, Phi increased)');
    const resemblesAblation = results.REM_DREAM.meta < results.WAKE.meta * 0.5;
    console.log(`  REM Meta significantly reduced: ${resemblesAblation ? 'YES' : 'NO'}`);
    if (resemblesAblation) {
        console.log('  -> HYPOTHESIS SUPPORTED: "Dreaming = Consciousness without Metacognition"\n');
    }

    // KEY INSIGHT
    console.log('================================================================');
    console.log('  KEY INSIGHT');
    console.log('================================================================\n');

    if (meditationMoreCoherent && remLowerMeta) {
        console.log('Three distinct consciousness states demonstrated:\n');
        console.log('  WAKE:       External input -> Variable coherence');
        console.log('  MEDITATION: Sensory gated + Meta intact -> Peak coherence');
        console.log('  REM DREAM:  Sensory gated + Meta dampened -> Racing mind\n');
        console.log('The ONLY difference between Meditation and Dreaming is METACOGNITION.\n');
        console.log('This computationally validates the contemplative insight:');
        console.log('"The difference between the sage and the sleeper is awareness of awareness."\n');
    }

    console.log('================================================================\n');

    // Export chart
    const exporter = new ChartExporter('./results');
    exporter.exportConsciousnessStates(results);
}

runExperiment().catch(err => {
    console.error('Experiment failed:', err);
    process.exit(1);
});
