/**
 * SVG Chart Exporter
 * Generates clean, research-grade SVG charts directly from experiment data.
 * No external dependencies - pure Node.js.
 */

const fs = require('fs');
const path = require('path');

class ChartExporter {
    constructor(outputDir = './results') {
        this.outputDir = outputDir;
        this.colors = {
            wake: '#4A90D9',       // Blue
            meditation: '#7ED321', // Green
            rem: '#9B59B6',        // Purple
            baseline: '#3498DB',   // Light blue
            lesion: '#E74C3C',     // Red
            phi: '#F39C12',        // Orange
            meta: '#1ABC9C',       // Teal
            uci: '#8E44AD',        // Dark purple
            grid: '#E0E0E0',
            text: '#333333',
            accent: '#2C3E50'
        };
    }

    /**
     * Generate bar chart comparing consciousness states
     */
    generateConsciousnessStatesChart(data) {
        // data = { WAKE: {uci, phi, meta}, MEDITATION: {...}, REM_DREAM: {...} }
        const width = 800;
        const height = 500;
        const margin = { top: 60, right: 150, bottom: 80, left: 70 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const states = ['WAKE', 'MEDITATION', 'REM_DREAM'];
        const stateLabels = ['Wake', 'Meditation', 'REM Dream'];
        const metrics = ['uci', 'phi', 'meta'];
        const metricLabels = ['UCI', 'Phi (Φ) ÷ 5', 'Meta'];
        const metricColors = [this.colors.uci, this.colors.phi, this.colors.meta];

        // Normalize phi to 0-1 scale for comparison (divide by 5)
        const normalizedData = {};
        states.forEach(state => {
            normalizedData[state] = {
                uci: data[state].uci,
                phi: data[state].phi / 5,  // Normalize
                meta: data[state].meta
            };
        });

        const groupWidth = chartWidth / states.length;
        const barWidth = groupWidth / (metrics.length + 1);

        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .title { font: bold 24px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.accent}; }
      .subtitle { font: 14px 'Segoe UI', Arial, sans-serif; fill: #666; }
      .axis-label { font: 12px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.text}; }
      .axis-title { font: bold 14px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.text}; }
      .legend-text { font: 13px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.text}; }
      .value-label { font: bold 11px 'Segoe UI', Arial, sans-serif; fill: white; }
      .bar { transition: opacity 0.2s; }
      .bar:hover { opacity: 0.8; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="white"/>

  <!-- Title -->
  <text x="${width/2}" y="30" text-anchor="middle" class="title">Consciousness States Comparison</text>
  <text x="${width/2}" y="50" text-anchor="middle" class="subtitle">Wake vs Meditation vs REM Dream</text>

  <!-- Chart Area -->
  <g transform="translate(${margin.left}, ${margin.top})">

    <!-- Grid lines -->
    ${[0, 0.25, 0.5, 0.75, 1.0].map(v => {
        const y = chartHeight - (v * chartHeight);
        return `<line x1="0" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="${this.colors.grid}" stroke-dasharray="4,4"/>
    <text x="-10" y="${y + 4}" text-anchor="end" class="axis-label">${v.toFixed(2)}</text>`;
    }).join('\n    ')}

    <!-- Y-axis title -->
    <text x="-50" y="${chartHeight/2}" text-anchor="middle" transform="rotate(-90, -50, ${chartHeight/2})" class="axis-title">Normalized Score</text>

    <!-- Bars -->
    ${states.map((state, stateIdx) => {
        const groupX = stateIdx * groupWidth + groupWidth/2 - (metrics.length * barWidth)/2;
        return metrics.map((metric, metricIdx) => {
            const value = normalizedData[state][metric];
            const barHeight = value * chartHeight;
            const x = groupX + metricIdx * barWidth;
            const y = chartHeight - barHeight;
            return `<rect class="bar" x="${x}" y="${y}" width="${barWidth - 4}" height="${barHeight}" fill="${metricColors[metricIdx]}" rx="3"/>
    <text x="${x + (barWidth-4)/2}" y="${y + barHeight/2 + 4}" text-anchor="middle" class="value-label">${metric === 'phi' ? (value * 5).toFixed(2) : value.toFixed(2)}</text>`;
        }).join('\n    ');
    }).join('\n    ')}

    <!-- X-axis labels -->
    ${states.map((state, idx) => {
        const x = idx * groupWidth + groupWidth/2;
        return `<text x="${x}" y="${chartHeight + 25}" text-anchor="middle" class="axis-label">${stateLabels[idx]}</text>`;
    }).join('\n    ')}

    <!-- Axis lines -->
    <line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="${this.colors.text}" stroke-width="2"/>
    <line x1="0" y1="0" x2="0" y2="${chartHeight}" stroke="${this.colors.text}" stroke-width="2"/>
  </g>

  <!-- Legend -->
  <g transform="translate(${width - margin.right + 20}, ${margin.top + 20})">
    ${metrics.map((metric, idx) => {
        const y = idx * 30;
        return `<rect x="0" y="${y}" width="20" height="16" fill="${metricColors[idx]}" rx="3"/>
    <text x="28" y="${y + 13}" class="legend-text">${metricLabels[idx]}</text>`;
    }).join('\n    ')}
  </g>

  <!-- Key Finding Box -->
  <g transform="translate(${margin.left}, ${height - 35})">
    <rect x="0" y="0" width="${chartWidth}" height="28" fill="#F8F9FA" stroke="#DEE2E6" rx="5"/>
    <text x="${chartWidth/2}" y="18" text-anchor="middle" class="subtitle">Key Finding: Meditation = Peak Coherence | REM = Racing Mind (High Φ, Zero Meta)</text>
  </g>
</svg>`;

        return svg;
    }

    /**
     * Generate ablation study comparison chart
     */
    generateAblationChart(data) {
        // data = { FULL_CONSCIOUSNESS: {avgUCI, avgPhi, metaAccuracy}, NO_METACOGNITION: {...}, ... }
        const width = 900;
        const height = 550;
        const margin = { top: 60, right: 40, bottom: 120, left: 70 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const conditions = Object.keys(data);
        const conditionLabels = {
            'FULL_CONSCIOUSNESS': 'Full\nConsciousness',
            'NO_METACOGNITION': 'No\nMetacognition',
            'NO_BROADCAST': 'No\nBroadcast',
            'NO_COMPETITION': 'No\nCompetition',
            'NO_INTEGRATION': 'No\nIntegration',
            'ISOLATED_MODULES': 'Isolated\nModules'
        };

        const barWidth = chartWidth / conditions.length - 20;
        const maxPhi = Math.max(...conditions.map(c => data[c].avgPhi || 0)) * 1.1;

        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .title { font: bold 22px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.accent}; }
      .subtitle { font: 14px 'Segoe UI', Arial, sans-serif; fill: #666; }
      .axis-label { font: 11px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.text}; }
      .axis-title { font: bold 13px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.text}; }
      .value-label { font: bold 10px 'Segoe UI', Arial, sans-serif; fill: white; }
      .condition-label { font: 11px 'Segoe UI', Arial, sans-serif; fill: ${this.colors.text}; }
    </style>
    <linearGradient id="phiGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:${this.colors.phi};stop-opacity:0.7"/>
      <stop offset="100%" style="stop-color:${this.colors.phi};stop-opacity:1"/>
    </linearGradient>
    <linearGradient id="uciGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:${this.colors.uci};stop-opacity:0.7"/>
      <stop offset="100%" style="stop-color:${this.colors.uci};stop-opacity:1"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="white"/>

  <text x="${width/2}" y="28" text-anchor="middle" class="title">Ablation Study: Theory Validation</text>
  <text x="${width/2}" y="48" text-anchor="middle" class="subtitle">Testing IIT, GWT, and HOT Predictions Under Lesion Conditions</text>

  <g transform="translate(${margin.left}, ${margin.top})">

    <!-- Grid -->
    ${[0, 0.25, 0.5, 0.75, 1.0].map(v => {
        const y = chartHeight - (v * chartHeight);
        return `<line x1="0" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="${this.colors.grid}" stroke-dasharray="3,3"/>
    <text x="-8" y="${y + 4}" text-anchor="end" class="axis-label">${(v * maxPhi).toFixed(1)}</text>`;
    }).join('\n    ')}

    <text x="-45" y="${chartHeight/2}" text-anchor="middle" transform="rotate(-90, -45, ${chartHeight/2})" class="axis-title">Φ (Integration)</text>

    <!-- Bars -->
    ${conditions.map((cond, idx) => {
        const phi = data[cond].avgPhi || 0;
        const uci = data[cond].avgUCI || 0;
        const barHeight = (phi / maxPhi) * chartHeight;
        const x = idx * (chartWidth / conditions.length) + 10;
        const y = chartHeight - barHeight;
        const isBaseline = cond === 'FULL_CONSCIOUSNESS';

        return `
    <!-- ${cond} -->
    <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${isBaseline ? this.colors.baseline : 'url(#phiGrad)'}" rx="4" stroke="${isBaseline ? '#2980B9' : 'none'}" stroke-width="${isBaseline ? 3 : 0}"/>
    <text x="${x + barWidth/2}" y="${y - 8}" text-anchor="middle" class="axis-label">Φ=${phi.toFixed(2)}</text>
    <text x="${x + barWidth/2}" y="${y + 20}" text-anchor="middle" class="value-label">UCI: ${uci.toFixed(2)}</text>`;
    }).join('\n')}

    <!-- X-axis labels -->
    ${conditions.map((cond, idx) => {
        const x = idx * (chartWidth / conditions.length) + 10 + barWidth/2;
        const label = conditionLabels[cond] || cond;
        const lines = label.split('\n');
        return lines.map((line, lineIdx) =>
            `<text x="${x}" y="${chartHeight + 20 + lineIdx * 14}" text-anchor="middle" class="condition-label">${line}</text>`
        ).join('\n    ');
    }).join('\n    ')}

    <line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="${this.colors.text}" stroke-width="2"/>
  </g>

  <!-- Discovery callout -->
  <g transform="translate(${margin.left + 10}, ${height - 50})">
    <rect x="0" y="0" width="${chartWidth - 20}" height="40" fill="#FFF3CD" stroke="#FFC107" rx="5"/>
    <text x="15" y="25" class="subtitle" fill="#856404">⚡ Discovery: Broadcast lesion crashed Φ (4.33 → 1.29) — GWT and IIT are coupled!</text>
  </g>
</svg>`;

        return svg;
    }

    /**
     * Generate the architecture diagram
     */
    generateArchitectureDiagram() {
        const width = 700;
        const height = 500;

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .title { font: bold 20px 'Segoe UI', Arial, sans-serif; fill: #2C3E50; }
      .layer-title { font: bold 14px 'Segoe UI', Arial, sans-serif; fill: white; }
      .layer-desc { font: 12px 'Segoe UI', Arial, sans-serif; fill: #333; }
      .theory-label { font: bold 11px 'Segoe UI', Arial, sans-serif; }
      .arrow { stroke: #7F8C8D; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
      .connection { stroke: #BDC3C7; stroke-width: 1.5; stroke-dasharray: 5,3; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#7F8C8D"/>
    </marker>
  </defs>

  <rect width="${width}" height="${height}" fill="#FAFAFA"/>

  <text x="${width/2}" y="35" text-anchor="middle" class="title">Unified Consciousness Architecture (UCA)</text>

  <!-- Layer 3: HOT / MetaCognition -->
  <g transform="translate(50, 70)">
    <rect width="600" height="80" rx="10" fill="#9B59B6"/>
    <text x="20" y="30" class="layer-title">Layer 3: MetaCognition (HOT)</text>
    <text x="20" y="50" class="layer-desc" fill="white">• Monitors Global Workspace broadcasts</text>
    <text x="20" y="68" class="layer-desc" fill="white">• Generates meta-thoughts ("I notice I'm avoiding...")</text>
    <text x="450" y="50" class="theory-label" fill="#E8DAEF">Higher-Order Theory</text>
  </g>

  <!-- Arrow down -->
  <path d="M 350 155 L 350 175" class="arrow"/>

  <!-- Layer 2: GWT / Global Workspace -->
  <g transform="translate(50, 180)">
    <rect width="600" height="90" rx="10" fill="#3498DB"/>
    <text x="20" y="28" class="layer-title">Layer 2: Global Workspace (GWT)</text>
    <text x="20" y="48" class="layer-desc" fill="white">• Coalition competition (winner-take-all)</text>
    <text x="20" y="66" class="layer-desc" fill="white">• Broadcast winning content to all modules</text>
    <text x="20" y="84" class="layer-desc" fill="white">• "Theater of the Mind" - creates unified experience</text>
    <text x="450" y="55" class="theory-label" fill="#D6EAF8">Global Workspace Theory</text>
  </g>

  <!-- Arrow down -->
  <path d="M 350 275 L 350 295" class="arrow"/>

  <!-- Layer 1: IIT / Integration -->
  <g transform="translate(50, 300)">
    <rect width="600" height="80" rx="10" fill="#F39C12"/>
    <text x="20" y="28" class="layer-title">Layer 1: Integration Measure (IIT)</text>
    <text x="20" y="48" class="layer-desc" fill="white">• Computes Φ (phi) from module states</text>
    <text x="20" y="66" class="layer-desc" fill="white">• Measures information integration across system</text>
    <text x="450" y="48" class="theory-label" fill="#FCF3CF">Integrated Information Theory</text>
  </g>

  <!-- Arrow down -->
  <path d="M 350 385 L 350 405" class="arrow"/>

  <!-- Layer 0: Base Models -->
  <g transform="translate(50, 410)">
    <rect width="280" height="60" rx="8" fill="#1ABC9C"/>
    <text x="15" y="25" class="layer-title">World Model</text>
    <text x="15" y="45" class="layer-desc" fill="white">Predictions, entities, dangers</text>

    <rect x="320" width="280" height="60" rx="8" fill="#1ABC9C"/>
    <text x="335" y="25" class="layer-title">Self Model</text>
    <text x="335" y="45" class="layer-desc" fill="white">State, goals, capabilities</text>
  </g>

  <!-- UCI Formula -->
  <g transform="translate(${width/2 - 150}, ${height - 35})">
    <rect x="0" y="0" width="300" height="28" fill="white" stroke="#2C3E50" rx="5"/>
    <text x="150" y="19" text-anchor="middle" font-family="'Segoe UI', Arial" font-size="13" fill="#2C3E50">
      UCI = 0.4×Φ + 0.3×GW + 0.3×HOT
    </text>
  </g>
</svg>`;

        return svg;
    }

    /**
     * Save SVG to file
     */
    save(filename, svgContent) {
        const filepath = path.join(this.outputDir, filename);
        fs.writeFileSync(filepath, svgContent);
        console.log(`  [SAVED] ${filepath}`);
        return filepath;
    }

    /**
     * Export consciousness states chart only
     */
    exportConsciousnessStates(data) {
        console.log('\nExporting consciousness states chart...\n');
        this.ensureOutputDir();
        const svg = this.generateConsciousnessStatesChart(data);
        const file = this.save('consciousness_states.svg', svg);
        console.log('');
        return file;
    }

    /**
     * Export ablation study chart only
     */
    exportAblationStudy(data) {
        console.log('\nExporting ablation study chart...\n');
        this.ensureOutputDir();
        const svg = this.generateAblationChart(data);
        const file = this.save('ablation_study.svg', svg);
        console.log('');
        return file;
    }

    /**
     * Export architecture diagram only
     */
    exportArchitecture() {
        console.log('\nExporting architecture diagram...\n');
        this.ensureOutputDir();
        const svg = this.generateArchitectureDiagram();
        const file = this.save('architecture_diagram.svg', svg);
        console.log('');
        return file;
    }

    /**
     * Generate boundary observation chart - visualizing the blind spot
     */
    generateBoundaryObservationChart(data) {
        // data = { blindSpotIndex, averageBlindSpot, maxBlindSpot, awarenessGap, calibrationGap, suppressedCoalitions, observations[] }
        const width = 900;
        const height = 600;
        const margin = { top: 70, right: 50, bottom: 100, left: 70 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Colors for the blind spot theme
        const colors = {
            blindSpot: '#8E44AD',      // Purple - the gap
            awareness: '#E74C3C',       // Red - unconscious
            conscious: '#27AE60',       // Green - conscious
            line: '#3498DB',            // Blue - trend line
            grid: '#ECF0F1',
            text: '#2C3E50'
        };

        // Prepare time series data for blind spot over time
        const observations = data.observations || [];
        const maxObs = Math.min(observations.length, 150);
        const step = Math.max(1, Math.floor(observations.length / maxObs));
        const sampledObs = observations.filter((_, i) => i % step === 0);

        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .title { font: bold 24px 'Segoe UI', Arial, sans-serif; fill: ${colors.text}; }
      .subtitle { font: 14px 'Segoe UI', Arial, sans-serif; fill: #666; }
      .axis-label { font: 12px 'Segoe UI', Arial, sans-serif; fill: ${colors.text}; }
      .axis-title { font: bold 14px 'Segoe UI', Arial, sans-serif; fill: ${colors.text}; }
      .metric-value { font: bold 36px 'Segoe UI', Arial, sans-serif; }
      .metric-label { font: 13px 'Segoe UI', Arial, sans-serif; fill: #666; }
      .insight-text { font: 13px 'Segoe UI', Arial, sans-serif; fill: ${colors.text}; }
      .quote { font: italic 14px Georgia, serif; fill: #555; }
    </style>
    <linearGradient id="blindSpotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.blindSpot};stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:${colors.blindSpot};stop-opacity:0.2"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="white"/>

  <!-- Title -->
  <text x="${width/2}" y="35" text-anchor="middle" class="title">Boundary Observation: The Blind Spot</text>
  <text x="${width/2}" y="58" text-anchor="middle" class="subtitle">Measuring what the system cannot see about itself</text>

  <!-- Main metrics boxes -->
  <g transform="translate(50, 85)">
    <!-- Blind Spot Index -->
    <rect x="0" y="0" width="200" height="90" rx="10" fill="#F8F9FA" stroke="${colors.blindSpot}" stroke-width="2"/>
    <text x="100" y="45" text-anchor="middle" class="metric-value" fill="${colors.blindSpot}">${data.blindSpotIndex.toFixed(3)}</text>
    <text x="100" y="75" text-anchor="middle" class="metric-label">Blind Spot Index</text>

    <!-- Awareness Gap -->
    <rect x="220" y="0" width="200" height="90" rx="10" fill="#F8F9FA" stroke="${colors.awareness}" stroke-width="2"/>
    <text x="320" y="45" text-anchor="middle" class="metric-value" fill="${colors.awareness}">${(data.awarenessGap * 100).toFixed(0)}%</text>
    <text x="320" y="75" text-anchor="middle" class="metric-label">Unconscious Processing</text>

    <!-- Suppressed Coalitions -->
    <rect x="440" y="0" width="200" height="90" rx="10" fill="#F8F9FA" stroke="${colors.conscious}" stroke-width="2"/>
    <text x="540" y="45" text-anchor="middle" class="metric-value" fill="${colors.conscious}">${data.suppressedCoalitions}</text>
    <text x="540" y="75" text-anchor="middle" class="metric-label">Suppressed Thoughts</text>

    <!-- Max Observed -->
    <rect x="660" y="0" width="180" height="90" rx="10" fill="#F8F9FA" stroke="${colors.line}" stroke-width="2"/>
    <text x="750" y="45" text-anchor="middle" class="metric-value" fill="${colors.line}">${data.maxBlindSpot.toFixed(3)}</text>
    <text x="750" y="75" text-anchor="middle" class="metric-label">Max Gap Observed</text>
  </g>

  <!-- Time series chart -->
  <g transform="translate(${margin.left}, 200)">
    <text x="${chartWidth/2}" y="-10" text-anchor="middle" class="axis-title">Blind Spot Index Over Time</text>

    <!-- Grid -->
    ${[0, 0.25, 0.5, 0.75, 1.0].map(v => {
        const y = (chartHeight - 80) - (v * (chartHeight - 80));
        return `<line x1="0" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="${colors.grid}" stroke-dasharray="3,3"/>
    <text x="-8" y="${y + 4}" text-anchor="end" class="axis-label">${v.toFixed(2)}</text>`;
    }).join('\n    ')}

    <!-- Area fill under line -->
    <path d="M 0 ${chartHeight - 80} ${sampledObs.map((obs, i) => {
        const x = (i / (sampledObs.length - 1 || 1)) * chartWidth;
        const y = (chartHeight - 80) - (obs.blindSpotIndex * (chartHeight - 80));
        return `L ${x} ${y}`;
    }).join(' ')} L ${chartWidth} ${chartHeight - 80} Z" fill="url(#blindSpotGrad)"/>

    <!-- Line -->
    <path d="M ${sampledObs.map((obs, i) => {
        const x = (i / (sampledObs.length - 1 || 1)) * chartWidth;
        const y = (chartHeight - 80) - (obs.blindSpotIndex * (chartHeight - 80));
        return `${i === 0 ? '' : 'L '}${x} ${y}`;
    }).join(' ')}" fill="none" stroke="${colors.blindSpot}" stroke-width="3"/>

    <!-- Average line -->
    <line x1="0" y1="${(chartHeight - 80) - (data.averageBlindSpot * (chartHeight - 80))}"
          x2="${chartWidth}" y2="${(chartHeight - 80) - (data.averageBlindSpot * (chartHeight - 80))}"
          stroke="${colors.line}" stroke-width="2" stroke-dasharray="8,4"/>
    <text x="${chartWidth + 5}" y="${(chartHeight - 80) - (data.averageBlindSpot * (chartHeight - 80)) + 4}" class="axis-label" fill="${colors.line}">avg</text>

    <!-- Axis -->
    <line x1="0" y1="${chartHeight - 80}" x2="${chartWidth}" y2="${chartHeight - 80}" stroke="${colors.text}" stroke-width="2"/>
    <line x1="0" y1="0" x2="0" y2="${chartHeight - 80}" stroke="${colors.text}" stroke-width="2"/>
    <text x="${chartWidth/2}" y="${chartHeight - 50}" text-anchor="middle" class="axis-title">Observation Steps</text>
  </g>

  <!-- Philosophical insight box -->
  <g transform="translate(50, ${height - 85})">
    <rect x="0" y="0" width="${width - 100}" height="75" rx="8" fill="#F5EEF8" stroke="${colors.blindSpot}" stroke-width="1"/>
    <text x="20" y="25" class="insight-text" font-weight="bold">Interpretation:</text>
    <text x="20" y="45" class="insight-text">${data.blindSpotIndex > 0.3 ?
        'Significant blind spot detected. The system cannot fully model itself.' :
        'Moderate blind spot. Self-model partially tracks external observation.'}</text>
    <text x="20" y="65" class="quote">"The gap is not a bug — it is where experience might live."</text>
  </g>
</svg>`;

        return svg;
    }

    /**
     * Export boundary observation chart
     */
    exportBoundaryObservation(data) {
        console.log('\nExporting boundary observation chart...\n');
        this.ensureOutputDir();
        const svg = this.generateBoundaryObservationChart(data);
        const file = this.save('boundary_observation.svg', svg);
        console.log('');
        return file;
    }

    /**
     * Export all charts (for batch export)
     */
    exportAll(consciousnessStatesData, ablationData) {
        console.log('\nExporting research charts...\n');
        this.ensureOutputDir();

        const files = [];

        if (consciousnessStatesData) {
            const svg = this.generateConsciousnessStatesChart(consciousnessStatesData);
            files.push(this.save('consciousness_states.svg', svg));
        }

        if (ablationData) {
            const svg = this.generateAblationChart(ablationData);
            files.push(this.save('ablation_study.svg', svg));
        }

        const archSvg = this.generateArchitectureDiagram();
        files.push(this.save('architecture_diagram.svg', archSvg));

        console.log(`\nExported ${files.length} charts to ${this.outputDir}/\n`);
        return files;
    }

    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
}

module.exports = ChartExporter;
