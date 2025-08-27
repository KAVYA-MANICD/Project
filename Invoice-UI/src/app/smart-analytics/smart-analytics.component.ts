import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';
import { SmartAnalyticsService } from './smart-analytics.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-smart-analytics',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './smart-analytics.component.html',
  styleUrls: ['./smart-analytics.component.css']
})
export class SmartAnalyticsComponent implements OnInit {
  metrics: any = { invoicesPerMonth: [] };
  loading = true;
  error: string | null = null;

  // Chart instance and config
  private chart: Chart | null = null;
  public chartConfig: ChartConfiguration<any> = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{ label: 'Invoices', data: [] }]
    },
    options: {}
  };

  constructor(private analyticsService: SmartAnalyticsService) {}

  ngOnInit(): void {
    // register Chart.js components once
    try {
      Chart.register(...registerables);
    } catch (e) {
      // ignore if already registered
    }

    this.fetchMetrics();
  }

  fetchMetrics() {
    this.loading = true;
    this.analyticsService.getOverview().subscribe({
      next: (data: any) => {
        this.metrics = data;
        // prepare chart data
        const labels = data.invoicesPerMonth.map((m: any) => String(m.month));
        const datasetRaw = data.invoicesPerMonth.map((m: any) => m.count);
        // coerce to numbers
        const dataset = datasetRaw.map((v: any) => Number(v ?? 0));
        this.chartConfig.data!.labels = labels;
        // choose chart type: if only one point, use bar for visibility
        if (dataset.length <= 1) {
          this.chartConfig.type = 'bar';
          Object.assign(this.chartConfig.data!.datasets![0], {
            backgroundColor: 'rgba(33,150,243,0.9)',
            borderColor: 'rgba(33,150,243,1)',
            borderWidth: 1
          });
        } else {
          this.chartConfig.type = 'line';
          Object.assign(this.chartConfig.data!.datasets![0], {
            backgroundColor: 'rgba(33,150,243,0.2)',
            borderColor: 'rgba(33,150,243,1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          });
        }

        this.chartConfig.data!.datasets![0].data = dataset as any[];

        // ensure y axis begins at zero and shows integer ticks for small counts
        this.chartConfig.options = this.chartConfig.options || {};
        (this.chartConfig.options as any).scales = (this.chartConfig.options as any).scales || {};
        (this.chartConfig.options as any).scales.y = { beginAtZero: true, ticks: { stepSize: 1 } };

        // un-hide before rendering so the canvas exists in DOM
        this.loading = false;
        // short delay to allow Angular to render the canvas
        setTimeout(() => this.renderChart(), 60);
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to load analytics';
        this.loading = false;
      }
    });
  }

  renderChart() {
    try {
      const ctx = (document.getElementById('invoicesChart') as HTMLCanvasElement | null)?.getContext('2d');
      if (!ctx) {
        console.warn('Canvas context not found for invoicesChart');
        return;
      }
      if (this.chart) {
        this.chart.destroy();
      }
  // ensure responsive and sizing
  this.chartConfig.options = this.chartConfig.options || {};
  (this.chartConfig.options as any).responsive = true;
  (this.chartConfig.options as any).maintainAspectRatio = false;
  (this.chartConfig.options as any).scales = (this.chartConfig.options as any).scales || { y: { beginAtZero: true } };

  console.debug('Rendering chart with', this.chartConfig.data?.labels, this.chartConfig.data?.datasets?.[0]?.data);
      try {
        this.chart = new Chart(ctx, this.chartConfig as any);
      } catch (chartErr) {
        console.warn('Chart.js render failed, drawing fallback', chartErr);
        // simple fallback draw: draw bars proportional to data
        const data = (this.chartConfig.data?.datasets?.[0].data || []) as number[];
        const labels = (this.chartConfig.data?.labels || []) as string[];
        // clear canvas
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (data.length === 0) return;
        const max = Math.max(...data);
        const padding = 20;
        const barWidth = (canvas.width - padding * 2) / data.length * 0.7;
        data.forEach((v, i) => {
          const h = (v / (max || 1)) * (canvas.height - padding * 2);
          const x = padding + i * ((canvas.width - padding * 2) / data.length) + ((canvas.width - padding * 2) / data.length - barWidth) / 2;
          const y = canvas.height - padding - h;
          ctx.fillStyle = 'rgba(33,150,243,0.8)';
          ctx.fillRect(x, y, barWidth, h);
          ctx.fillStyle = '#222';
          ctx.font = '12px sans-serif';
          ctx.fillText(labels[i] || String(i), x, canvas.height - 6);
        });
      }
    } catch (e) {
      console.error('Chart render failed', e);
    }
  }
}
