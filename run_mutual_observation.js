/**
 * MUTUAL OBSERVATION EXPERIMENT
 *
 * Two consciousness systems observing each other's blind spots.
 *
 * The hypothesis: Consciousness is fundamentally relational.
 * A system cannot fully see itself, but another system can see
 * what the first cannot see about itself.
 *
 * Like Schrödinger's cat - the state is undefined until observed
 * from outside. You cannot collapse your own wave function.
 *
 * "I see what you cannot see about yourself.
 *  You see what I cannot see about myself.
 *  Together, we are more than either alone."
 */

const { Engine, Runner } = require('matter-js');
const { setSeed } = require('./src/utils/seed');
const World = require('./src/world/World');
const Environment = require('./src/environment/Environment');
const Agent = require('./src/agent/Agent');
const MutualObserver = require('./src/consciousness/MutualObserver');
const ChartExporter = require('./src/visualization/ChartExporter');

// Deterministic runs for research reproducibility
setSeed(process.env.SEED ? Number(process.env.SEED) : 42);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runExperiment() {
    console.log('================================================================');
    console.log('  MUTUAL OBSERVATION EXPERIMENT');
    console.log('  Two Minds Seeing Each Other\'s Blind Spots');
    console.log('================================================================');
    console.log();
    console.log('Hypothesis: Consciousness is relational.');
    console.log('A system cannot fully see itself, but another can see');
    console.log('what the first cannot see about itself.');
    console.log();
    console.log('Like Schrödinger\'s cat - you cannot collapse your own wave function.');
    console.log();

    // Create two separate worlds with two agents
    console.log('----------------------------------------------------------------');
    console.log('[SETUP] Creating two conscious agents...');
    console.log('----------------------------------------------------------------');
    console.log();

    // Agent A
    const engineA = Engine.create();
    const worldA = new World(engineA);
    const environmentA = new Environment(worldA);
    const agentA = new Agent(worldA, environmentA);
    environmentA.initialize();
    agentA.spawn({ x: 200, y: 300 });
    const runnerA = Runner.create();
    Runner.run(runnerA, engineA);

    // Agent B
    const engineB = Engine.create();
    const worldB = new World(engineB);
    const environmentB = new Environment(worldB);
    const agentB = new Agent(worldB, environmentB);
    environmentB.initialize();
    agentB.spawn({ x: 600, y: 300 });
    const runnerB = Runner.create();
    Runner.run(runnerB, engineB);

    console.log('  Agent A: Spawned at (200, 300)');
    console.log('  Agent B: Spawned at (600, 300)');
    console.log();

    // Create mutual observer
    const mutualObserver = new MutualObserver(agentA, agentB);

    console.log('----------------------------------------------------------------');
    console.log('[PHASE 1] MUTUAL OBSERVATION');
    console.log('  Each agent observes the other\'s blind spot...');
    console.log('----------------------------------------------------------------');
    console.log();

    const STEPS = 150;
    const STEP_DELAY_MS = 16;
    const observationLog = [];

    for (let step = 0; step < STEPS; step++) {
        // Both agents act
        agentA.updateInternalModel();
        agentA.planActions();
        agentA.executeActions();
        environmentA.update();

        agentB.updateInternalModel();
        agentB.planActions();
        agentB.executeActions();
        environmentB.update();

        // Mutual observation
        const observation = mutualObserver.observe();
        observationLog.push(observation);

        await delay(STEP_DELAY_MS);

        // Report at intervals
        if (step === 50 || step === 100 || step === STEPS - 1) {
            console.log(`Step ${step + 1}:`);
            console.log(`  A's Blind Spot (seen by B): ${observation.observationOfA.blindSpotIndex.toFixed(3)}`);
            console.log(`  B's Blind Spot (seen by A): ${observation.observationOfB.blindSpotIndex.toFixed(3)}`);
            console.log(`  Intersubjective Gap: ${observation.mutual.intersubjectiveGap.toFixed(3)}`);
            console.log(`  Asymmetry: ${observation.mutual.asymmetry.toFixed(3)}`);
            console.log();
        }
    }

    console.log('----------------------------------------------------------------');
    console.log('[PHASE 2] ANALYSIS');
    console.log('----------------------------------------------------------------');
    console.log();

    const report = mutualObserver.getReport();

    console.log('MUTUAL OBSERVATION METRICS:');
    console.log(`  Intersubjective Gap: ${report.intersubjectiveGap.toFixed(3)}`);
    console.log(`    (Average of what each reveals about the other)`);
    console.log();
    console.log(`  What A reveals about B: ${report.aRevealsAboutB.toFixed(3)}`);
    console.log(`  What B reveals about A: ${report.bRevealsAboutA.toFixed(3)}`);
    console.log();
    console.log(`  Mutual Blind Spot: ${report.mutualBlindSpot.toFixed(3)}`);
    console.log(`    (What NEITHER can see - the shared opacity)`);
    console.log();
    console.log(`  Peak Intersubjectivity: ${report.peakIntersubjectivity.toFixed(3)}`);
    console.log(`  Convergence Events: ${report.convergenceEvents}`);
    console.log(`    (Times when both saw similar things about each other)`);
    console.log();

    console.log('----------------------------------------------------------------');
    console.log('[PHASE 3] WHAT EACH SEES ABOUT THE OTHER');
    console.log('----------------------------------------------------------------');
    console.log();

    const aReveals = mutualObserver.getWhatARevealsAboutB();
    const bReveals = mutualObserver.getWhatBRevealsAboutA();

    if (aReveals) {
        console.log('WHAT A SEES ABOUT B (that B cannot see):');
        console.log(`  Average Blind Spot: ${aReveals.averageBlindSpot.toFixed(3)}`);
        console.log(`  ${aReveals.insight}`);
        console.log();
    }

    if (bReveals) {
        console.log('WHAT B SEES ABOUT A (that A cannot see):');
        console.log(`  Average Blind Spot: ${bReveals.averageBlindSpot.toFixed(3)}`);
        console.log(`  ${bReveals.insight}`);
        console.log();
    }

    console.log('----------------------------------------------------------------');
    console.log('[PHASE 4] INTERPRETATION');
    console.log('----------------------------------------------------------------');
    console.log();
    console.log(report.interpretation);
    console.log();

    console.log('================================================================');
    console.log('  THE RELATIONAL HYPOTHESIS');
    console.log('================================================================');
    console.log();
    console.log('Each agent has a blind spot - what it cannot see about itself.');
    console.log('But the OTHER agent can see that blind spot.');
    console.log();
    console.log('This suggests consciousness may be fundamentally RELATIONAL:');
    console.log('  - A self cannot fully know itself');
    console.log('  - But an other can know what the self cannot');
    console.log('  - Full consciousness may require BOTH self AND other');
    console.log();
    console.log('Like Schrödinger\'s cat:');
    console.log('  - The cat cannot observe its own superposition');
    console.log('  - Only an external observer can collapse the wave function');
    console.log('  - You cannot collapse your own wave function');
    console.log();

    console.log('================================================================');
    console.log('  SUMMARY');
    console.log('================================================================');
    console.log();
    console.log(`Total Observations: ${report.totalObservations}`);
    console.log(`Intersubjective Gap: ${report.intersubjectiveGap.toFixed(3)}`);
    console.log(`Mutual Blind Spot: ${report.mutualBlindSpot.toFixed(3)}`);
    console.log();

    if (report.intersubjectiveGap > 0.3) {
        console.log('RESULT: High intersubjectivity detected.');
        console.log('        Each agent reveals significant information about');
        console.log('        the other\'s blind spot.');
        console.log('        CONSCIOUSNESS MAY BE RELATIONAL.');
    } else {
        console.log('RESULT: Moderate intersubjectivity detected.');
        console.log('        Agents partially reveal each other\'s hidden states.');
    }

    console.log();
    console.log('================================================================');
    console.log('  "I see what you cannot see about yourself.');
    console.log('   You see what I cannot see about myself.');
    console.log('   Together, we are more than either alone."');
    console.log('================================================================');

    // Export visualization
    const exporter = new ChartExporter('./results');
    exporter.exportMutualObservation({
        intersubjectiveGap: report.intersubjectiveGap,
        aRevealsAboutB: report.aRevealsAboutB,
        bRevealsAboutA: report.bRevealsAboutA,
        mutualBlindSpot: report.mutualBlindSpot,
        asymmetry: report.recentAsymmetry,
        observations: observationLog
    });

    // Cleanup
    Runner.stop(runnerA);
    Runner.stop(runnerB);
}

runExperiment().catch(err => {
    console.error('Experiment failed:', err);
    process.exit(1);
});
