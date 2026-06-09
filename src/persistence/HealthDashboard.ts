import fs from 'node:fs/promises';
import path from 'node:path';
import { Lesson, HealthMetrics } from '../shared/types.js';

export class HealthDashboard {
  constructor(private readonly projectRoot: string) {}

  async generateReport(lessons: Lesson[]): Promise<string> {
    const metrics = this.calculateMetrics(lessons);
    const html = this.renderHtml(metrics, lessons);
    
    const reportPath = path.join(this.projectRoot, 'ACE_HEALTH_REPORT.html');
    await fs.writeFile(reportPath, html);
    return reportPath;
  }

  private calculateMetrics(lessons: Lesson[]): HealthMetrics {
    const severityMap: Record<string, number> = { low: 1, medium: 3, high: 10 };
    
    return lessons.reduce((acc, lesson) => {
      acc.totalLessons++;
      if (lesson.type === 'gap') acc.gapCount++;
      if (lesson.type === 'error') acc.errorCount++;
      if (lesson.type === 'pattern') acc.patternCount++;
      if (lesson.type === 'decision') acc.decisionCount++;
      acc.severityScore += severityMap[lesson.severity] || 0;
      return acc;
    }, {
      totalLessons: 0,
      gapCount: 0,
      errorCount: 0,
      patternCount: 0,
      decisionCount: 0,
      severityScore: 0,
      lastAnalysis: new Date().toLocaleString()
    } as HealthMetrics);
  }

  private renderHtml(metrics: HealthMetrics, lessons: Lesson[]): string {
    const lessonsList = lessons.map(l => `
      <div class="lesson ${l.severity}">
        <strong>${l.type.toUpperCase()}</strong>: ${l.description}<br>
        <small>Recommendation: ${l.recommendation}</small>
      </div>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <title>ACE Health Report</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; background: #f4f4f9; color: #333; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1rem; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
    .metric { text-align: center; }
    .metric-value { font-size: 1.5rem; font-weight: bold; color: #007bff; }
    .lesson { padding: 0.75rem; border-left: 4px solid #ccc; margin-bottom: 0.5rem; background: #fafafa; }
    .lesson.high { border-left-color: #dc3545; }
    .lesson.medium { border-left-color: #ffc107; }
    .lesson.low { border-left-color: #28a745; }
    h1 { color: #2c3e50; }
  </style>
</head>
<body>
  <h1>ACE Workflow Health Report</h1>
  <div class="card">
    <p>Last Analysis: ${metrics.lastAnalysis}</p>
    <div class="metrics">
      <div class="metric"><div class="metric-value">${metrics.totalLessons}</div>Total Lessons</div>
      <div class="metric"><div class="metric-value">${metrics.gapCount}</div>Gaps</div>
      <div class="metric"><div class="metric-value">${metrics.errorCount}</div>Errors</div>
      <div class="metric"><div class="metric-value">${metrics.severityScore}</div>Context Debt Score</div>
    </div>
  </div>
  <div class="card">
    <h2>Detailed Findings</h2>
    ${lessonsList || '<p>No issues detected.</p>'}
  </div>
</body>
</html>
    `;
  }
}
