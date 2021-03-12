import React from 'react';
import * as d3 from 'd3';

const style = {
    position: 'absolute',
    bottom: '54px',
    left: '20px',
};

class WaterStorageLegend extends React.Component {

    constructor(props) {
        super(props);
        this.cmweLegend = this.cmweLegend.bind(this);
        this.precipitationLegend = this.precipitationLegend.bind(this);
        this.evaporationLegend = this.evaporationLegend.bind(this);
        this.runoffLegend = this.runoffLegend.bind(this);
    }

    cmweLegend() {

        document.getElementById("legend").innerHTML = "";
        var w = 250, h = 40;

        var key = d3.select("#legend")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "10%")
            .attr("stop-color", "#711c27")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "35%")
            .attr("stop-color", "#d9876e")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#f4f4f4")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "75%")
            .attr("stop-color", "#7daccf")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "90%")
            .attr("stop-color", "#233f72")
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w)
            .attr("height", h - 30)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([250, 0])
            .domain([19, -19]);

        var yAxis = d3.axisBottom()
            .scale(y)
            .ticks(5);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,20)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("axis title");
    }

    precipitationLegend() {

        document.getElementById("legend").innerHTML = "";
        var w = 250, h = 40;

        var key = d3.select("#legend")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "1%")
            .attr("stop-color", "#999999")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "2.1%")
            .attr("stop-color", "#78cef3")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "5%")
            .attr("stop-color", "#769fcd")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "10.2%")
            .attr("stop-color", "#414ea8")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "19.05%")
            .attr("stop-color", "#87f073")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "25.4%")
            .attr("stop-color", "#66b25b")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "38.1%")
            .attr("stop-color", "#52854e")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "50.8%")
            .attr("stop-color", "#f7f773")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "63.5%")
            .attr("stop-color", "#f6df95")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "76.2%")
            .attr("stop-color", "#ecaf60")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "101.6%")
            .attr("stop-color", "#b14848")
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w)
            .attr("height", h - 30)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([250, 0])
            .domain([126, 1]);

        var yAxis = d3.axisBottom()
            .scale(y)
            .ticks(5);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,20)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("axis title");
    }

    evaporationLegend() {

        document.getElementById("legend").innerHTML = "";
        var w = 250, h = 40;

        var key = d3.select("#legend")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "1%")
            .attr("stop-color", "#999999")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "13.4%")
            .attr("stop-color", "#78cef3")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "33.4%")
            .attr("stop-color", "#769fcd")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "66.8%")
            .attr("stop-color", "#414ea8")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#87f073")
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w)
            .attr("height", h - 30)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([250, 0])
            .domain([19, -0.5]);

        var yAxis = d3.axisBottom()
            .scale(y)
            .ticks(5);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,20)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("axis title");
    }

    runoffLegend() {

        document.getElementById("legend").innerHTML = "";
        var w = 250, h = 40;

        var key = d3.select("#legend")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "1%")
            .attr("stop-color", "#999999")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "1.7%")
            .attr("stop-color", "#78cef3")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "4.4%")
            .attr("stop-color", "#769fcd")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "8.81%")
            .attr("stop-color", "#414ea8")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "13.23%")
            .attr("stop-color", "#87f073")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "17.6%")
            .attr("stop-color", "#66b25b")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "26.46%")
            .attr("stop-color", "#52854e")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "25.28%")
            .attr("stop-color", "#f7f773")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "35.2%")
            .attr("stop-color", "#f6df95")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "52.91%")
            .attr("stop-color", "#ecaf60")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "70.56%")
            .attr("stop-color", "#b14848")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "88%")
            .attr("stop-color", "#8f4342")
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w)
            .attr("height", h - 30)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([250, 0])
            .domain([150, 1]);

        var yAxis = d3.axisBottom()
            .scale(y)
            .ticks(5);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,20)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("axis title");
    }

    componentDidMount() {

        let layers = this.props.layers;
        if (layers === undefined) {
            layers = this.props.mapRef.current.getLayers();
        }

        var cmwe = layers[0];
        var cmweLegendFunc = this.cmweLegend;
        cmwe.on('change:visible', function(){
            if (cmwe.getVisible()) {
                cmweLegendFunc();
            }
        });

        var precipitation = layers[1];
        var precipitationLegendFunc = this.precipitationLegend;
        precipitation.on('change:visible', function(){
            if (precipitation.getVisible()) {
                precipitationLegendFunc();
            }
        });

        var evaporation = layers[2];
        var evaporationLegendFunc = this.evaporationLegend;
        evaporation.on('change:visible', function(){
            if (evaporation.getVisible()) {
                evaporationLegendFunc();
            }
        });

        var runoff = layers[3];
        var runoffLegendFunc = this.runoffLegend;
        runoff.on('change:visible', function(){
            if (runoff.getVisible()) {
                runoffLegendFunc();
            }
        });

        this.cmweLegend();
    }

    render() {
        let rootStyle = this.props.style;
        if (rootStyle === undefined) {
            rootStyle = {
                position: 'absolute',
                bottom: '54px',
                left: '20px',
            };
        }

        return (
            <div id="legend" style={rootStyle}></div>
        );
    }
}

export default WaterStorageLegend;