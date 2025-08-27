import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';
import { SmartAnalyticsService } from './smart-analytics.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { MetricCardComponent } from '../metric-card/metric-card.component';

@Component({
  selector: 'app-smart-analytics',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MetricCardComponent],
  templateUrl: './smart-analytics.component.html',
  styleUrls: ['./smart-analytics.component.css']
})
export class SmartAnalyticsComponent implements OnInit {
  metrics: any = {
    totalInvoices: 0,
    totalRevenue: 0,
    averageInvoiceValue: 0,
    highestInvoiceValue: 0,
    lowestInvoiceValue: 0,
    invoicesPerMonth: [],
    revenuePerMonth: [],
    avgInvoiceValuePerMonth: [],
    invoicesByClient: [],
    invoicesByProduct: []
  };
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

        this.loading = false;
        // Render all charts after a short delay
        setTimeout(() => this.renderAllCharts(), 60);
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to load analytics';
        this.loading = false;
      }
    });
  }

  private charts: Chart[] = [];

  renderAllCharts() {
    this.renderInvoicesByMonthChart();
    this.renderRevenueByMonthChart();
    this.renderAvgInvoiceValueTrendChart();
    this.renderInvoicesByClientChart();
    this.renderInvoicesByProductChart();
  }

  createChart(canvasId: string, config: ChartConfiguration): Chart | null {
    const ctx = (document.getElementById(canvasId) as HTMLCanvasElement | null)?.getContext('2d');
    if (!ctx) {
      console.warn(`Canvas context not found for ${canvasId}`);
      return null;
    }

    // Destroy existing chart if it exists
    const existingChart = this.charts.find(c => c.canvas.id === canvasId);
    if (existingChart) {
      existingChart.destroy();
    }

    const newChart = new Chart(ctx, config);
    this.charts.push(newChart);
    return newChart;
  }

  renderInvoicesByMonthChart() {
    const labels = this.metrics.invoicesPerMonth.map((m: any) => m.month);
    const data = this.metrics.invoicesPerMonth.map((m: any) => m.count);

    this.createChart('invoicesByMonthChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Invoices',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  renderRevenueByMonthChart() {
    const labels = this.metrics.revenuePerMonth.map((m: any) => m.month);
    const data = this.metrics.revenuePerMonth.map((m: any) => m.revenue);

    this.createChart('revenueByMonthChart', {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Revenue',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  renderAvgInvoiceValueTrendChart() {
    const labels = this.metrics.avgInvoiceValuePerMonth.map((m: any) => m.month);
    const data = this.metrics.avgInvoiceValuePerMonth.map((m: any) => m.value);

    this.createChart('avgInvoiceValueTrendChart', {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Average Value',
          data,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  renderInvoicesByClientChart() {
    const labels = this.metrics.invoicesByClient.map((c: any) => c.client);
    const data = this.metrics.invoicesByClient.map((c: any) => c.count);

    this.createChart('invoicesByClientChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Invoices by Client',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  renderInvoicesByProductChart() {
    const labels = this.metrics.invoicesByProduct.map((p: any) => p.product);
    const data = this.metrics.invoicesByProduct.map((p: any) => p.count);

    this.createChart('invoicesByProductChart', {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Invoices by Product/Service',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }
}
