import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {WKT} from "ol/format";
import {transform} from "ol/proj";

class WaterStorageWatershedDiagram extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_feature: props.selected_feature,
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

        this.changeRegion = this.changeRegion.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    updateChart() {
        var theComponent = this;
        var format = new WKT();
        var result = format.writeGeometry(this.state.selected_feature.getGeometry(),
            {
                //featureProjection: 'EPSG:3857',
                featureProjection: 'EPSG:2163',
                dataProjection: 'EPSG:4326'
            });

        //console.log(`selected feature: ${result}`);
        //console.log(`transformed feature: ${transform(this.state.selected_feature, 'EPSG:2163', 'EPSG:4326')}`);

        fetch("/TWSA/region",
            {
                method: 'POST',
                body: JSON.stringify({
                    selected_feature: result
                    /*
                    selected_feature: format.writeGeometry(this.state.selected_feature.getGeometry(),
                        {
                            //featureProjection: 'EPSG:3857',
                            featureProjection: 'EPSG:2136',
                            dataProjection: 'EPSG:4326'
                        })
                     */
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

    changeRegion(selected_feature) {
        this.setState({
            selected_feature: selected_feature
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
