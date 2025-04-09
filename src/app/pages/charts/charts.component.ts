import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartService } from './chart.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements AfterViewInit {
  constructor(private chartService: ChartService) {}
  Highcharts: typeof Highcharts = Highcharts;
  chartsOption5: Highcharts.Options = {};
  chartsOption1: Highcharts.Options = {};

  chartsOption2: Highcharts.Options = {};
  chartsOption3: Highcharts.Options = {};

  ngAfterViewInit(): void {
    this.loadUserByWorkspace();
    this.requestByWorkspace();
    this.showActivityByCategory();
    this.showUserRoleByWorkspace();
  }

  loadUserByWorkspace() {
    this.chartService
      .getUserByWorkspaceGroup()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          // Extract workspace names and user counts
          const workspaceData = Object.values(data).map((workspace: any) => ({
            workspaceName: workspace.workspaceName,
            userCount: workspace.user.length,
          }));

          // console.log(workspaceData); // Logs [{ workspaceName: 'Claude AI', userCount: 1 }]

          // Set chart options
          this.chartsOption5 = {
            chart: { type: 'column' },
            title: { text: 'Workspace' },
            xAxis: {
              min: 0,
              title: { text: 'Workspace' },
              categories: workspaceData.map((item) => item.workspaceName),
            },
            yAxis: {
              title: { text: 'Users per Workspace' },
              startOnTick: true,
              endOnTick: true,
              tickInterval: 1,
              allowDecimals: false,
            },

            series: [
              {
                type: 'bar',
                name: 'Users',
                data: workspaceData.map((item) => item.userCount),
              },
            ],
            colors: ['#3357FF'],
          };

          // Force redraw if needed
          if (this.Highcharts && this.chartsOption5) {
            Highcharts.chart(
              document.querySelector('#chart1') as HTMLElement,
              this.chartsOption5
            );
          }
        },
        error: (err) => console.error('Error fetching data:', err),
      });
  }

  requestByWorkspace() {
    this.chartService
      .getRequestByWorkspaceGroup()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          // Process data to calculate the number of requests per workspace
          const seriesData = Object.values(data).map((workspace: any) => ({
            name: workspace.workspaceName, // Workspace name
            count: workspace.request.length, // Number of requests for the workspace
          }));

          // console.log(seriesData); // Logs data for each workspace

          this.chartsOption1 = {
            chart: { type: 'column' }, // Use a column chart for clearer visualization
            title: { text: 'Requests per Workspace' },
            xAxis: {
              title: { text: 'Workspaces' },
              categories: seriesData.map((workspace) => workspace.name), // Workspace names on X-axis
            },
            yAxis: {
              title: { text: 'Number of Requests' },
              allowDecimals: false,
            },
            series: [
              {
                type: 'column',
                name: 'Number of Requests',
                data: seriesData.map((workspace) => workspace.count), // Number of requests on Y-axis
              },
            ],
            colors: ['#FF5733', '#33FF57', '#3357FF'], // Optional: Colors for the bars
          };

          // Force redraw if needed
          if (this.Highcharts && this.chartsOption1) {
            Highcharts.chart(
              document.querySelector('#chart2') as HTMLElement,
              this.chartsOption1
            );
          }
        },
        error: (err) => console.error('Error fetching data:', err),
      });
  }

  showActivityByCategory() {
    this.chartService
      .showAllActivity()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          // console.log(data);

          // Define categories and initialize their counts
          const categoryCounts: Record<string, number> = {
            create: 0,
            edit: 0,
            add: 0,
            delete: 0,
            save: 0,
          };

          // Process the data to count occurrences of each action
          data.forEach((activity: any) => {
            const action: string = activity.action.toLowerCase();
            if (action.split('-')[0] in categoryCounts) {
              // Check if action is a valid key
              categoryCounts[action.split('-')[0]]++;
            }
          });

          // console.log(categoryCounts); // Logs counts for each category

          // Prepare data for the pie chart
          const pieData = Object.entries(categoryCounts).map(
            ([category, count]) => ({
              name: category,
              y: count,
            })
          );

          // console.log(pieData); // Logs data for the pie chart

          // Configure the chart options
          this.chartsOption2 = {
            chart: {
              type: 'pie',
            },
            title: {
              text: 'Activity Distribution by Category',
            },
            series: [
              {
                type: 'pie',
                name: 'Activities',
                data: pieData,
              },
            ],
            colors: ['#FF5733', '#33FF57', '#3357FF', '#FFD700', '#8E44AD'], // Colors for the slices
          };

          // Force redraw if needed
          if (this.Highcharts && this.chartsOption2) {
            Highcharts.chart(
              document.querySelector('#chart3') as HTMLElement,
              this.chartsOption2
            );
          }
        },
        error: (err) => console.error('Error fetching data:', err),
      });
  }
  showUserRoleByWorkspace() {
    this.chartService
      .getUserByWorkspaceGroup()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data: any[]) => {
          console.log(data);

          const roleCountsByWorkspace: Record<
            string,
            Record<'admin' | 'viewer' | 'editor', number>
          > = {};

          Object.keys(data).forEach((workspaceName) => {
            roleCountsByWorkspace[workspaceName] = {
              admin: 0,
              viewer: 0,
              editor: 0,
            }; // Initialize counts

            data[workspaceName as any].user.forEach(
              (user: { role: 'admin' | 'viewer' | 'editor' }) => {
                const userRole = user.role; // Explicitly define userRole as 'admin' | 'viewer' | 'editor'

                if (userRole in roleCountsByWorkspace[workspaceName]) {
                  roleCountsByWorkspace[workspaceName][userRole]++; // Safe indexing
                }
              }
            );
          });

          console.log(roleCountsByWorkspace); // Logs counts of roles per workspace

          // Prepare categories (X-axis) and series data
          const categories = Object.keys(roleCountsByWorkspace); // Workspace names
          const series: Highcharts.SeriesOptionsType[] = [
            {
              type: 'column',
              name: 'Admin',
              data: categories.map(
                (workspace: string) =>
                  roleCountsByWorkspace[workspace]?.admin ?? 0
              ),
            },
            {
              type: 'column',
              name: 'Viewer',
              data: categories.map(
                (workspace: string) =>
                  roleCountsByWorkspace[workspace]?.viewer ?? 0
              ),
            },
            {
              type: 'column',
              name: 'Editor',
              data: categories.map(
                (workspace: string) =>
                  roleCountsByWorkspace[workspace]?.editor ?? 0
              ),
            },
          ];

          console.log(series); // Logs data for the bar chart

          // Configure the chart options
          this.chartsOption3 = {
            chart: {
              type: 'column', // Multi-column chart
            },
            title: {
              text: 'User Roles by Workspace',
            },
            xAxis: {
              categories: categories, // Workspace names
              title: { text: 'Workspaces' },
            },
            yAxis: {
              title: { text: 'Number of Users' },
              allowDecimals: false,
            },
            series: series, // Data for each role
            colors: ['#FF5733', '#33FF57', '#3357FF'], // Colors for Admin, Viewer, Editor
            plotOptions: {
              column: {
                grouping: true, // Enables grouped columns
                dataLabels: {
                  enabled: true, // Show data labels
                },
              },
            },
          };

          // Force redraw if needed
          if (this.Highcharts && this.chartsOption3) {
            Highcharts.chart(
              document.querySelector('#chart4') as HTMLElement,
              this.chartsOption3
            );
          }
        },
        error: (err) => console.error('Error fetching data:', err),
      });
  }
}
