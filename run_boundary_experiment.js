/**
 * BOUNDARY OBSERVATION EXPERIMENT
 *
 * This experiment probes the "hard problem" by measuring the gap between:
 * - What the agent THINKS it is (self-model)
 * - What the agent ACTUALLY is (external observation)
 *
 * The hypothesis: Consciousness might live in this gap - the blind spot
 * where a system cannot fully model itself.
 *
 * "To view it from the outside of the infinite"
 */

const { Engine, Runner } = require('matter-js');
const { setSeed } = require('./src/utils/seed');
const World = require('./src/world/World');
const Environment = require('./src/environment/Environment');
const Agent = require('./src/agent/Agent');
const BoundaryObserver = require('./src/consciousness/BoundaryObserver');
const ChartExporter = require('./src/visualization/ChartExporter');

// Deterministic runs for research reproducibility
setSeed(process.env.SEED ? Number(process.env.SEED) : 42);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runExperiment() {
    console.log('================================================================');
    console.log('  BOUNDARY OBSERVATION EXPERIMENT');
    console.log('  Probing the Gap Between Self and Observation');
    console.log('================================================================');
    console.log();
    console.log('Hypothesis: The "hard problem" lives in the blind spot -');
    console.log('            what a system cannot see about itself.');
    console.log();

    // Setup - using the same pattern as ablation study
    const engine = Engine.create();
    const world = new World(engine);
    const environment = new Environment(world);
    const agent = new Agent(world, environment);

    // Initialize and spawn
    environment.initialize();
    agent.spawn({ x: 400, y: 300 });

    // Start physics runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Create the Boundary Observer - the external eye
    const observer = new BoundaryObserver(agent);

    console.log('----------------------------------------------------------------');
    console.log('[PHASE 1] BASELINE OBSERVATION');
    console.log('  Watching agent in normal operation...');
    console.log('----------------------------------------------------------------');
    console.log();

    const STEPS = 150;
    const STEP_DELAY_MS = 16;
    const observationLog = [];

    // Run simulation with observation
    for (let step = 0; step < STEPS; step++) {
        // Agent acts
        agent.updateInternalModel();
        agent.planActions();
        agent.executeActions();
        environment.update();

        // Observer watches
        const observation = observer.observe();
        observationLog.push(observation);

        await delay(STEP_DELAY_MS);

        // Report at intervals
        if (step === 50 || step === 100 || step === STEPS - 1) {
            console.log(`Step ${step + 1}:`);
            console.log(`  Blind Spot Index: ${observation.blindSpotIndex.toFixed(3)}`);
            console.log(`  Awareness Gap: ${(observation.gaps.awarenessGap * 100).toFixed(1)}% unconscious`);
            console.log(`  Calibration Gap: ${(observation.gaps.calibrationGap * 100).toFixed(1)}%`);
            console.log();
        }
    }

    console.log('----------------------------------------------------------------');
    console.log('[PHASE 2] ANALYSIS');
    console.log('----------------------------------------------------------------');
    console.log();

    // Get the observer's report
    const report = observer.getReport();

    console.log('BLIND SPOT METRICS:');
    console.log(`  Current Blind Spot Index: ${report.blindSpotIndex.toFixed(3)}`);
    console.log(`  Average Blind Spot: ${report.averageBlindSpot.toFixed(3)}`);
    console.log(`  Maximum Observed: ${report.maxBlindSpot.toFixed(3)}`);
    console.log();

    console.log('COMPONENT GAPS:');
    console.log(`  Awareness Gap: ${(report.awarenessGap * 100).toFixed(1)}%`);
    console.log(`    (Processing that never reached consciousness)`);
    console.log(`  Calibration Gap: ${(report.calibrationGap * 100).toFixed(1)}%`);
    console.log(`    (Difference between confidence and actual performance)`);
    console.log();

    console.log('UNCONSCIOUS ACTIVITY:');
    console.log(`  Suppressed Coalitions: ${report.unconsciousProcessing.suppressedCoalitions}`);
    console.log(`  (Thoughts that competed but never became "conscious")`);
    console.log();

    console.log('INTERPRETATION:');
    console.log(`  ${report.interpretation}`);
    console.log();

    // Experience gap analysis
    const experienceGap = observer.getExperienceGapAnalysis();

    console.log('----------------------------------------------------------------');
    console.log('[PHASE 3] THE EXPERIENCE GAP');
    console.log('----------------------------------------------------------------');
    console.log();

    console.log('What the agent was "conscious" of:');
    console.log(`  ${experienceGap.consciousContents.join(', ') || 'None recorded'}`);
    console.log();

    console.log('All activity sources:');
    console.log(`  ${experienceGap.allActivitySources.join(', ') || 'None'}`);
    console.log();

    console.log('Activity OUTSIDE awareness:');
    console.log(`  ${experienceGap.unconsciousSources.join(', ') || 'None'}`);
    console.log();

    console.log('INSIGHT:');
    console.log(`  ${experienceGap.insight}`);
    console.log();

    console.log('================================================================');
    console.log('  PHILOSOPHICAL IMPLICATIONS');
    console.log('================================================================');
    console.log();
    console.log('The Blind Spot Index measures what the system CANNOT see about itself.');
    console.log();
    console.log('If consciousness is fundamentally about self-reference, and');
    console.log('self-reference is inherently incomplete (Godel), then:');
    console.log();
    console.log('  THE GAP IS NOT A BUG - IT IS WHERE EXPERIENCE LIVES.');
    console.log();
    console.log('A system with zero blind spot would have perfect self-knowledge,');
    console.log('but might have no "inner life" - nothing it is like to be it.');
    console.log();
    console.log('A system with a blind spot has something it cannot reduce to');
    console.log('its own self-model. That irreducible remainder might be qualia.');
    console.log();

    // Summary stats
    console.log('================================================================');
    console.log('  SUMMARY');
    console.log('================================================================');
    console.log();
    console.log(`Total Observations: ${report.totalObservations}`);
    console.log(`Final Blind Spot Index: ${report.blindSpotIndex.toFixed(3)}`);
    console.log();

    if (report.blindSpotIndex > 0.2) {
        console.log('RESULT: Significant blind spot detected.');
        console.log('        The agent cannot fully model itself.');
        console.log('        This gap is a candidate locus for experience.');
    } else {
        console.log('RESULT: Small blind spot detected.');
        console.log('        Self-model closely tracks external observation.');
        console.log('        Consider increasing system complexity to widen the gap.');
    }

    console.log();
    console.log('================================================================');
    console.log('  "The difference between the sage and the sleeper');
    console.log('   is awareness of awareness."');
    console.log();
    console.log('  But what watches the watcher?');
    console.log('================================================================');

    // Export visualization
    const exporter = new ChartExporter('./results');
    exporter.exportBoundaryObservation({
        blindSpotIndex: report.blindSpotIndex,
        averageBlindSpot: report.averageBlindSpot,
        maxBlindSpot: report.maxBlindSpot,
        awarenessGap: report.awarenessGap,
        calibrationGap: report.calibrationGap,
        suppressedCoalitions: report.unconsciousProcessing.suppressedCoalitions,
        observations: observationLog
    });

    // Cleanup
    Runner.stop(runner);
}

runExperiment().catch(err => {
    console.error('Experiment failed:', err);
    process.exit(1);
});
