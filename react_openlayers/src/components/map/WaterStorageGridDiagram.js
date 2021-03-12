import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class WaterStorageGridDiagram extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: props.latitude,
            longitude: props.longitude,
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

        this.changeLatLon = this.changeLatLon.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    updateChart() {
        var theComponent = this;
        fetch("/TWSA/grid",
            {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    lonlat: [this.state.longitude, this.state.latitude],
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

    changeLatLon(lat, lng) {
        this.setState({
            latitude: lat,
            longitude: lng
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

export default WaterStorageGridDiagram;
