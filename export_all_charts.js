/**
 * Export All Charts
 *
 * Generates all research charts using cached/sample data.
 * Run individual experiments first, or use this for the architecture diagram.
 *
 * Usage: node export_all_charts.js
 */

const ChartExporter = require('./src/visualization/ChartExporter');

const exporter = new ChartExporter('./results');

// Sample data from experiments (update with your actual results)
const consciousnessStates = {
    WAKE: { uci: 0.758, phi: 4.435, meta: 0.868 },
    MEDITATION: { uci: 1.000, phi: 4.207, meta: 1.000 },
    REM_DREAM: { uci: 0.700, phi: 4.253, meta: 0.000 }
};

const ablationResults = {
    FULL_CONSCIOUSNESS: { avgUCI: 0.817, avgPhi: 4.326, metaAccuracy: 0.500 },
    NO_METACOGNITION: { avgUCI: 0.738, avgPhi: 4.530, metaAccuracy: 0.000 },
    NO_BROADCAST: { avgUCI: 0.495, avgPhi: 1.290, metaAccuracy: 0.500 },
    NO_COMPETITION: { avgUCI: 0.810, avgPhi: 4.300, metaAccuracy: 0.500 },
    NO_INTEGRATION: { avgUCI: 0.608, avgPhi: 0.000, metaAccuracy: 0.500 },
    ISOLATED_MODULES: { avgUCI: 0.285, avgPhi: 0.000, metaAccuracy: 0.000 }
};

console.log('================================================================');
console.log('  BATCH CHART EXPORT');
console.log('================================================================\n');

exporter.exportConsciousnessStates(consciousnessStates);
exporter.exportAblationStudy(ablationResults);
exporter.exportArchitecture();

console.log('All charts exported to results/');
console.log('  - consciousness_states.svg');
console.log('  - ablation_study.svg');
console.log('  - architecture_diagram.svg');
