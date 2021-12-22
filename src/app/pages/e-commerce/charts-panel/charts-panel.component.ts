import { Component, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { ProfitChart } from '../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnDestroy {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = '2021';
  ordersChartData: OrdersChart;
  postChartData: OrdersChart;
  profitChartData: ProfitChart;

  @ViewChild('ordersChart', { static: true }) ordersChart: OrdersChartComponent;
  @ViewChild('ordersChart', { static: true }) postChart: OrdersChartComponent;
  @ViewChild('profitChart', { static: true }) profitChart: ProfitChartComponent;

  constructor(private ordersProfitChartService: OrdersProfitChartData, private authService: AuthService) {
    this.ordersProfitChartService.getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.chartPanelSummary = summary;
      });

    this.getOrdersChartData(this.period);
    this.getProfitChartData(this.period);
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Profit') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.authService.getUserMonthData(period).pipe().toPromise().then((res) =>{
      var value = 'user'
      if(res.status === true){
        this.ordersProfitChartService.getOrdersChartData(res.chartData, value)
          .pipe(takeWhile(() => this.alive))
          .subscribe(ordersChartData => {
            this.ordersChartData = ordersChartData;
          });
        }
      })
  }

  getProfitChartData(period: string) {
    this.authService.getPostMonthData(period).pipe().toPromise().then((res) =>{
      var value = 'post'
      if(res.status === true){
        this.ordersProfitChartService.getOrdersChartData(res.postData, value)
          .pipe(takeWhile(() => this.alive))
          .subscribe(ordersChartData => {
            this.postChartData = ordersChartData;
          });
        }
      })
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
