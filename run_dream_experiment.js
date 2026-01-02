/**
 * Dream Cycle Experiment
 *
 * Tests the hypothesis that consciousness metrics change during "sleep"
 * when sensory inputs are gated and processing runs on internal replay.
 *
 * Questions we're testing:
 * 1. Does Phi increase or decrease during sleep?
 * 2. Does the Global Workspace still function without external input?
 * 3. Does the "racing mind" phenomenon (high Phi, low meta) occur in dreams?
 *
 * Usage: node run_dream_experiment.js
 */

const { Engine, Runner } = require('matter-js');
const { setSeed } = require('./src/utils/seed');
const World = require('./src/world/World');
const Agent = require('./src/agent/Agent');
const Environment = require('./src/environment/Environment');
const DreamCycle = require('./src/consciousness/DreamCycle');

// Deterministic runs for research reproducibility
setSeed(process.env.SEED ? Number(process.env.SEED) : 42);

console.log('================================================================');
console.log('  DREAM CYCLE EXPERIMENT');
console.log('  Testing Consciousness During Sleep vs Wake');
console.log('================================================================\n');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runExperiment() {
    const engine = Engine.create();
    const world = new World(engine);
    const environment = new Environment(world);
    const agent = new Agent(world, environment);

    environment.initialize();
    agent.spawn({ x: 100, y: 100 });

    const dreamCycle = new DreamCycle(agent);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const WAKE_STEPS = 100;
    const SLEEP_STEPS = 100;
    const STEP_DELAY = 16;

    console.log(`Protocol: ${WAKE_STEPS} wake steps -> ${SLEEP_STEPS} sleep steps -> Analysis\n`);

    // PHASE 1: WAKE STATE
    console.log('----------------------------------------------------------------');
    console.log('[PHASE 1] WAKE STATE (Baseline)\n');

    const wakeMetrics = [];

    for (let step = 0; step < WAKE_STEPS; step++) {
        agent.updateInternalModel();
        agent.planActions();
        agent.executeActions();
        environment.update();

        if (step % 10 === 0) {
            const status = agent.getStatus();
            const cons = status.consciousness;
            wakeMetrics.push({
                step,
                uci: parseFloat(cons.UCI),
                phi: parseFloat(cons.layers.L1_Integration.phi),
                meta: parseFloat(cons.layers.L3_MetaCognition.accuracy),
                broadcasts: cons.layers.L2_GlobalWorkspace.broadcasts
            });
        }

        if (step % 50 === 0) {
            const status = agent.getStatus();
            const cons = status.consciousness;
            console.log(`  Wake Step ${step}: UCI=${cons.UCI}, Phi=${cons.layers.L1_Integration.phi}`);
        }

        await delay(STEP_DELAY);
    }

    const wakeAvg = {
        uci: wakeMetrics.reduce((s, m) => s + m.uci, 0) / wakeMetrics.length,
        phi: wakeMetrics.reduce((s, m) => s + m.phi, 0) / wakeMetrics.length,
        meta: wakeMetrics.reduce((s, m) => s + m.meta, 0) / wakeMetrics.length
    };

    console.log(`\n  Wake Averages: UCI=${wakeAvg.uci.toFixed(3)}, Phi=${wakeAvg.phi.toFixed(3)}, Meta=${wakeAvg.meta.toFixed(3)}\n`);

    // PHASE 2: SLEEP STATE
    console.log('----------------------------------------------------------------');
    console.log('[PHASE 2] SLEEP STATE (Sensory Gating Active)\n');

    dreamCycle.sleep();

    const sleepMetrics = [];

    for (let step = 0; step < SLEEP_STEPS; step++) {
        dreamCycle.dreamStep();
        await delay(STEP_DELAY);

        if (step % 10 === 0) {
            const status = agent.getStatus();
            const cons = status.consciousness;
            sleepMetrics.push({
                step,
                uci: parseFloat(cons.UCI),
                phi: parseFloat(cons.layers.L1_Integration.phi),
                meta: parseFloat(cons.layers.L3_MetaCognition.accuracy),
                broadcasts: cons.layers.L2_GlobalWorkspace.broadcasts
            });
        }

        if (step % 50 === 0) {
            const status = agent.getStatus();
            const cons = status.consciousness;
            const dreamState = dreamCycle.getState();
            console.log(`  Sleep Step ${step}: UCI=${cons.UCI}, Phi=${cons.layers.L1_Integration.phi}, Dreams=${dreamState.dreamCoalitions}`);
        }
    }

    const sleepAnalysis = dreamCycle.wake();

    const sleepAvg = {
        uci: sleepMetrics.reduce((s, m) => s + m.uci, 0) / sleepMetrics.length,
        phi: sleepMetrics.reduce((s, m) => s + m.phi, 0) / sleepMetrics.length,
        meta: sleepMetrics.reduce((s, m) => s + m.meta, 0) / sleepMetrics.length
    };

    console.log(`\n  Sleep Averages: UCI=${sleepAvg.uci.toFixed(3)}, Phi=${sleepAvg.phi.toFixed(3)}, Meta=${sleepAvg.meta.toFixed(3)}\n`);

    Runner.stop(runner);

    // ANALYSIS
    console.log('\n================================================================');
    console.log('  WAKE vs SLEEP COMPARISON');
    console.log('================================================================\n');

    console.log('+-------------+---------+---------+-----------+');
    console.log('| State       | Avg UCI | Avg Phi | Avg Meta  |');
    console.log('+-------------+---------+---------+-----------+');
    console.log(`| WAKE        | ${wakeAvg.uci.toFixed(3).padStart(7)} | ${wakeAvg.phi.toFixed(3).padStart(7)} | ${wakeAvg.meta.toFixed(3).padStart(9)} |`);
    console.log(`| SLEEP       | ${sleepAvg.uci.toFixed(3).padStart(7)} | ${sleepAvg.phi.toFixed(3).padStart(7)} | ${sleepAvg.meta.toFixed(3).padStart(9)} |`);
    console.log('+-------------+---------+---------+-----------+');

    const phiChange = ((sleepAvg.phi - wakeAvg.phi) / wakeAvg.phi * 100) || 0;
    const uciChange = ((sleepAvg.uci - wakeAvg.uci) / wakeAvg.uci * 100) || 0;
    const metaChange = ((sleepAvg.meta - wakeAvg.meta) / wakeAvg.meta * 100) || 0;

    console.log('\n================================================================');
    console.log('  FINDINGS');
    console.log('================================================================\n');

    console.log(`Phi (Integration): ${phiChange >= 0 ? '+' : ''}${phiChange.toFixed(1)}% change`);
    if (phiChange > 10) {
        console.log('  -> Phi INCREASED during sleep: Internal integration enhanced');
        console.log('  -> Supports: Sleep consolidates/integrates information');
    } else if (phiChange < -10) {
        console.log('  -> Phi DECREASED during sleep: Modules drifted apart');
        console.log('  -> Supports: Consciousness fragments without external anchoring');
    } else {
        console.log('  -> Phi remained STABLE during sleep');
    }

    console.log(`\nUCI (Unified Index): ${uciChange >= 0 ? '+' : ''}${uciChange.toFixed(1)}% change`);

    console.log(`\nMeta Accuracy: ${metaChange >= 0 ? '+' : ''}${metaChange.toFixed(1)}% change`);
    if (metaChange < -20) {
        console.log('  -> Metacognition REDUCED during sleep');
        console.log('  -> Supports: Dream state = reduced self-awareness');
    }

    console.log('\nDream Activity:');
    console.log(`  Memory replays: ${sleepAnalysis.replays}`);
    console.log(`  Dream coalitions generated: ${sleepAnalysis.dreamCoalitions}`);

    if (sleepAvg.phi > wakeAvg.phi && sleepAvg.meta < wakeAvg.meta * 0.8) {
        console.log('\n"RACING MIND" PATTERN DETECTED');
        console.log('  High internal activity (Phi up) with low self-awareness (Meta down)');
        console.log('  This matches the NO_METACOGNITION ablation finding');
        console.log('  -> Dreaming may be "consciousness without metacognition"');
    }

    if (sleepAnalysis.findings) {
        console.log('\nAdditional Findings:');
        sleepAnalysis.findings.forEach(f => console.log(`  - ${f}`));
    }

    console.log('\n================================================================');
    console.log('Experiment complete. Data explores whether sleep/dream states');
    console.log('show similar dissociations to ablation studies.');
    console.log('================================================================\n');
}

runExperiment().catch(err => {
    console.error('Experiment failed:', err);
    process.exit(1);
});
