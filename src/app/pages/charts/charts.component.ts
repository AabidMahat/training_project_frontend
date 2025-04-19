import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartService } from './chart.service';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements AfterViewInit, OnDestroy {
  constructor(private chartService: ChartService) {}

  // Highcharts instance
  Highcharts: typeof Highcharts = Highcharts;

  // Chart options
  chartsOption5: Highcharts.Options = {}; // Users by Workspace
  chartsOption1: Highcharts.Options = {}; // Requests by Workspace
  chartsOption2: Highcharts.Options = {}; // Activity by Category
  chartsOption3: Highcharts.Options = {}; // User Roles by Workspace

  // Track subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  ngAfterViewInit(): void {
    this.loadUserByWorkspace();
    this.requestByWorkspace();
    this.showActivityByCategory();
    this.showUserRoleByWorkspace();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }


  loadActiveDocumentByWorkspace(){
    const subscription =this.chartService
  }

  loadUserByWorkspace() {
    const subscription = this.chartService
      .getUserByWorkspaceGroup()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          // Extract workspace names and user counts
          const workspaceData = Object.values(data).map((workspace: any) => ({
            workspaceName: workspace.workspaceName,
            userCount: workspace.user.length,
          }));

          // Set chart options
          this.chartsOption5 = {
            chart: { type: 'column' },
            title: { text: 'Users per Workspace' },
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
                type: 'column', // Changed from 'bar' to 'column' to match other charts
                name: 'Users',
                data: workspaceData.map((item) => item.userCount),
              },
            ],
            colors: ['#3357FF'],
            credits: {
              enabled: false, // Remove Highcharts credits
            },
          };

          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            const chartElement = document.querySelector('#chart1');
            if (chartElement && this.Highcharts && this.chartsOption5) {
              Highcharts.chart(chartElement as HTMLElement, this.chartsOption5);
            }
          }, 0);
        },
        error: (err) => console.error('Error fetching user data:', err),
      });

    this.subscriptions.push(subscription);
  }

  requestByWorkspace() {
    const subscription = this.chartService
      .getRequestByWorkspaceGroup()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          const workspaces = Object.values(data);
          const categories = workspaces.map((ws: any) => ws.workspaceName);

          const approvedData: number[] = [];
          const rejectedData: number[] = [];
          const pendingData: number[] = [];

          workspaces.forEach((ws: any) => {
            const requests = ws.request || [];

            const statusCount = {
              approved: 0,
              rejected: 0,
              pending: 0,
            };

            requests.forEach((req: any) => {
              const status = req.requestStatus.toLowerCase();
              if (statusCount.hasOwnProperty(status)) {
                const key = status as keyof typeof statusCount;
                statusCount[key]++;
              }
            });

            approvedData.push(statusCount.approved);
            rejectedData.push(statusCount.rejected);
            pendingData.push(statusCount.pending);
          });

          this.chartsOption1 = {
            chart: {
              type: 'area',
            },
            title: {
              text: 'Request Status per Workspace',
            },
            xAxis: {
              categories,
              title: { text: 'Workspaces' },
              tickmarkPlacement: 'on',
              startOnTick: false,
              endOnTick: false,
            },
            yAxis: {
              title: {
                text: 'Number of Requests',
              },
              allowDecimals: false,
            },
            tooltip: {
              shared: true,
              valueSuffix: ' requests',
            },
            plotOptions: {
              area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                  lineWidth: 1,
                  lineColor: '#666666',
                },
              },
            },
            series: [
              {
                name: 'Approved',
                data: approvedData,
                color: '#28a745',
                type: 'area',
              },
              {
                name: 'Rejected',
                data: rejectedData,
                color: '#dc3545',
                type: 'area',
              },
              {
                name: 'Pending',
                data: pendingData,
                color: '#ffc107',
                type: 'area',
              },
            ],
            credits: {
              enabled: false,
            },
          };

          setTimeout(() => {
            const chartElement = document.querySelector('#chart2');
            if (chartElement && this.Highcharts && this.chartsOption1) {
              Highcharts.chart(chartElement as HTMLElement, this.chartsOption1);
            }
          }, 0);
        },
        error: (err) => console.error('Error fetching request data:', err),
      });

    this.subscriptions.push(subscription);
  }

  showActivityByCategory() {
    const subscription = this.chartService
      .showAllActivity()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          // Define categories and initialize their counts
          const categoryCounts: Record<string, number> = {
            create: 0,
            update: 0,
            add: 0,
            delete: 0,
            save: 0,
          };

          // Process the data to count occurrences of each action
          data.forEach((activity: any) => {
            const action: string = activity.action.toLowerCase();
            const actionType = action.split('-')[0];
            if (actionType in categoryCounts) {
              categoryCounts[actionType]++;
            }
          });

          // Prepare data for the pie chart - filter out zero values
          const pieData = Object.entries(categoryCounts)
            .filter(([_, count]) => count > 0)
            .map(([category, count]) => ({
              name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize
              y: count,
            }));

          // Configure the chart options
          this.chartsOption2 = {
            chart: {
              type: 'pie',
            },
            title: {
              text: 'Activity Distribution by Category',
            },
            tooltip: {
              pointFormat:
                '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})',
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f}%',
                },
              },
            },
            series: [
              {
                type: 'pie',
                name: 'Activities',
                data: pieData,
              },
            ],
            colors: ['#FF5733', '#33FF57', '#3357FF', '#FFD700', '#8E44AD'],
            credits: {
              enabled: false,
            },
          };

          setTimeout(() => {
            const chartElement = document.querySelector('#chart3');
            if (chartElement && this.Highcharts && this.chartsOption2) {
              Highcharts.chart(chartElement as HTMLElement, this.chartsOption2);
            }
          }, 0);
        },
        error: (err) => console.error('Error fetching activity data:', err),
      });

    this.subscriptions.push(subscription);
  }

  showUserRoleByWorkspace() {
    const subscription = this.chartService
      .getUserByWorkspaceGroup()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          console.log({
            data,
          });
          const roleCountsByWorkspace: Record<
            string,
            Record<'admin' | 'viewer' | 'editor', number>
          > = {};

          Object.keys(data).forEach((workspaceName) => {
            roleCountsByWorkspace[workspaceName] = {
              admin: 0,
              viewer: 0,
              editor: 0,
            };

            // Safe access to user array
            const users = data[workspaceName as any]?.user || [];

            users.forEach((user: { role: 'admin' | 'viewer' | 'editor' }) => {
              const userRole = user.role;
              if (userRole in roleCountsByWorkspace[workspaceName]) {
                roleCountsByWorkspace[workspaceName][userRole]++;
              }
            });
          });
          console.log({
            roleCountsByWorkspace,
          });

          // Prepare categories (X-axis) and series data
          const categories = Object.keys(roleCountsByWorkspace);

          console.log(categories);

          const series: Highcharts.SeriesOptionsType[] = [
            {
              type: 'bar',
              name: 'Admin',
              data: categories.map(
                (workspace: string) =>
                  roleCountsByWorkspace[workspace]?.admin ?? 0
              ),
              color: '#FF5733',
            },
            {
              type: 'bar',
              name: 'Viewer',
              data: categories.map(
                (workspace: string) =>
                  roleCountsByWorkspace[workspace]?.viewer ?? 0
              ),
              color: '#33FF57',
            },
            {
              type: 'bar',
              name: 'Editor',
              data: categories.map(
                (workspace: string) =>
                  roleCountsByWorkspace[workspace]?.editor ?? 0
              ),
              color: '#3357FF',
            },
          ];

          // Configure the chart options
          this.chartsOption3 = {
            chart: {
              type: 'bar',
            },
            title: {
              text: 'User Roles by Workspace',
            },
            xAxis: {
              categories: categories,
              title: { text: 'Workspaces' },
              crosshair: true,
            },
            yAxis: {
              title: { text: 'Number of Users' },
              allowDecimals: false,
              min: 0,
            },
            tooltip: {
              headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat:
                '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true,
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0,
                grouping: true,
                dataLabels: {
                  enabled: true,
                },
              },
            },
            series: series,
            credits: {
              enabled: false,
            },
          };

          setTimeout(() => {
            const chartElement = document.querySelector('#chart4');
            if (chartElement && this.Highcharts && this.chartsOption3) {
              Highcharts.chart(chartElement as HTMLElement, this.chartsOption3);
            }
          }, 0);
        },
        error: (err) => console.error('Error fetching user role data:', err),
      });

    this.subscriptions.push(subscription);
  }

  // Calculate total users across all workspaces
  getTotalUsers(): number {
    let total = 0;
    try {
      const series = this.chartsOption5?.series?.[0] as any;
      if (series?.data) {
        const userData = series.data as number[];
        total = userData.reduce(
          (sum, count) => sum + (typeof count === 'number' ? count : 0),
          0
        );
      }
    } catch (error) {
      console.error('Error calculating total users:', error);
    }
    return total;
  }

  // Calculate total requests across all workspaces
  getTotalRequests(): number {
    let total = 0;
    try {
      const series = this.chartsOption1?.series?.[0] as any;

      if (series?.data) {
        const requestData = series.data as number[];
        total = requestData.reduce(
          (sum, count) => sum + (typeof count === 'number' ? count : 0),
          0
        );
      }
    } catch (error) {
      console.error('Error calculating total requests:', error);
    }
    return total;
  }

  // Get total workspaces count
  getTotalWorkspaces(): number {
    try {
      const series = this.chartsOption5?.xAxis as any;

      if (series.categories) {
        const categories = series.categories as string[];
        return Array.isArray(categories) ? categories.length : 0;
      }
    } catch (error) {
      console.error('Error calculating total workspaces:', error);
    }
    return 0;
  }

  // Get total activities count
  getTotalActivities(): number {
    let total = 0;
    try {
      const series = this.chartsOption2?.series?.[0] as any;

      if (series.data) {
        const activityData = series.data as Array<{
          y: number;
        }>;
        total = activityData.reduce((sum, item) => sum + (item.y || 0), 0);
      }
    } catch (error) {
      console.error('Error calculating total activities:', error);
    }
    return total;
  }
}
