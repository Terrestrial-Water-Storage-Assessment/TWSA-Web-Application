import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class WaterStorageWatershedDiagram extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            watershed_id: props.watershed_id,
            chartOptions: {
                chart: {height: '300px'},
                title: {text: ''},
                subtitle: null,
                credits: false,
                xAxis: {
                    type: 'datetime',
                    labels: {
                        format: '{value:%Y-%m-%d}'
                    },
                },
                series: [],
                tooltip: {
                    xDateFormat: '%Y-%m-%d',
                }
            }
        };

        this.changeWatershed = this.changeWatershed.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    updateChart() {
        var theComponent = this;
        fetch("/TWSA/watershed",
            {
                method: 'POST',
                body: JSON.stringify({
                    watershed_id: this.state.watershed_id,
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                var newChartOptions = {
                    chart: theComponent.state.chartOptions.chart,
                    title: theComponent.state.chartOptions.title,
                    subtitle: theComponent.state.chartOptions.subtitle,
                    credits: false,
                    xAxis: theComponent.state.chartOptions.xAxis,
                    series: json,
                    tooltip: theComponent.state.chartOptions.tooltip
                };
                theComponent.setState({
                    chartOptions: newChartOptions
                })
            });
    }

    changeWatershed(watershed_id) {
        this.setState({
            watershed_id: watershed_id,
        });
        this.updateChart();
    }

    componentDidMount() {
        this.updateChart();
    }

    render() {
        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.chartOptions}
                />
            </div>
        );
    }
}

export default WaterStorageWatershedDiagram;
