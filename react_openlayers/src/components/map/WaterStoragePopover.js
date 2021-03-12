import React from 'react';
import ReactDOM from 'react-dom';
import OlOverlay from 'ol/Overlay';
import {toLonLat, transform} from "ol/proj";
import {Modal, Button, Tooltip} from 'antd';
import WaterStorageGridDiagram from './WaterStorageGridDiagram';
import WaterStorageWatershedDiagram from './WaterStorageWatershedDiagram';
import WaterStorageRegionDiagram from './WaterStorageRegionDiagram';
import './water_storage_popover.css';
import {Polygon, MultiPolygon} from 'ol/geom';
import {WKT} from 'ol/format';

const keyStyle = {
    fontWeight: 'bold',
    textAlign: 'right',
};

const valueStyle = {
    paddingLeft: '8px'
};

const noDataStyle = {
    fontWeight: 'bold',
    padding: '0px 0px 10px 20px'
}

class WaterStoragePopover extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            key: null,
            value: null,
            diagram_visible: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.showGridDiagrams = this.showGridDiagrams.bind(this);
        this.showWatershedDiagrams = this.showWatershedDiagrams.bind(this);
        this.showSelectedRegionDiagrams = this.showSelectedRegionDiagrams.bind(this);
        this.handleDiagramOk = this.handleDiagramOk.bind(this);
        this.handleDiagramCancel = this.handleDiagramCancel.bind(this);

        this.gridChart = React.createRef();
        this.watershedChart = React.createRef();
        this.regionChart = React.createRef();
    }

    handleClose(event) {
        this.popup.setPosition(undefined);
        event.target.blur();
        return false;
    }

    showGridDiagrams() {
        this.setState({
            diagram_visible: true,
            diagram_type: 'grid',
        });

        var thisComponent = this;
        setTimeout(function () {
            if (thisComponent.gridChart.current && thisComponent.gridChart.current.changeLatLon) {
                thisComponent.gridChart.current.changeLatLon(thisComponent.state.latitude, thisComponent.state.longitude);
            }
        }, 500);
    }

    showWatershedDiagrams() {
        this.setState({
            diagram_visible: true,
            diagram_type: 'watershed',
        });

        var thisComponent = this;
        setTimeout(function () {
            if (thisComponent.watershedChart.current && thisComponent.watershedChart.current.changeWatershed) {
                thisComponent.watershedChart.current.changeWatershed(thisComponent.state.watershed_id);
            }
        }, 500);
    }

    showSelectedRegionDiagrams() {
        this.setState({
            diagram_visible: true,
            diagram_type: 'region',
        });

        var thisComponent = this;
        setTimeout(function () {
            if (thisComponent.regionChart.current && thisComponent.regionChart.current.changeRegion) {
                thisComponent.regionChart.current.changeRegion(thisComponent.state.selected_feature);
            }
        }, 500);
    }


    handleDiagramOk(e) {
        this.setState({
            diagram_visible: false,
        });
    };

    handleDiagramCancel(e) {
        this.setState({
            diagram_visible: false,
        });
    };

    componentDidMount() {
        // setup popup
        this.popup = new OlOverlay({
            element: ReactDOM.findDOMNode(this).querySelector('#popup')
        });

        let map = this.props.map;
        if (map === undefined) {
            console.log("in popover: no map was given");
            map = this.props.mapRef.current.getMap()
        }

        let layers = this.props.layers;
        if (layers === undefined) {
            layers = this.props.mapRef.current.getLayers()
        }

        map.addOverlay(this.popup);

        map.on('singleclick', evt => {

            // the following experimental code tries to handle the feature clicked by the user
            let uploadLayers = [];
            map.getLayers().forEach(layer => {
                if (layer.get('name')) {
                    uploadLayers.push(layer);
                }
            });

            let selectedFeature = null;
            for (var i = 0; i < uploadLayers.length; i++) {
                let features = uploadLayers[i].getSource().getFeaturesAtCoordinate(evt.coordinate);
                for (var j = 0; j < features.length; j++) {
                    if (features[j].getGeometry() instanceof Polygon ||
                        features[j].getGeometry() instanceof MultiPolygon) {
                        selectedFeature = features[j];
                        break;
                    }
                }
                if (selectedFeature) {
                    break;
                }
            }

            if (selectedFeature) {
                var format = new WKT();
                var result = format.writeGeometry(selectedFeature.getGeometry(),
                    {
                        //featureProjection: 'EPSG:3857',
                        featureProjection: 'EPSG:2163',
                        dataProjection: 'EPSG:4326'
                    });
                //console.log(`selectedFeature: ${result}`);
                //console.log(`converted selectedFeature: ${transform(selectedFeature, 'EPSG:2163', 'EPSG:4326')}`);
            }

            // end of the experimental code

            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.getVisible()) {
                    var thePopup = this.popup;
                    var theComponent = this;
                    var toLonLatFunction = toLonLat;

                    //console.log(`evt.coordinate: ${evt.coordinate}`);
                    //console.log(`latlon: ${toLonLatFunction(evt.coordinate)}`);
                    //console.log(`check: ${transform(evt.coordinate, 'EPSG:2163', 'EPSG:4326')}`);

                    fetch("/TWSA/point",
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                time: layer.getSource().getParams().TIME,
                                //lonlat: toLonLatFunction(evt.coordinate),
                                lonlat: transform(evt.coordinate, 'EPSG:2163', 'EPSG:4326'),
                                target: layer.getSource().getParams().LAYERS
                            })
                        })
                        .then(function (response) {
                            return response.text();
                        })
                        .then(function (text) {
                            var data = JSON.parse(text);
                            if (data.key && data.value) {
                                theComponent.setState({
                                    time: data.time,
                                    latitude: data.latitude,
                                    longitude: data.longitude,
                                    key: data.key,
                                    value: data.value,
                                    watershed_id: data.water_shed_id,
                                    watershed_name: data.water_shed_name,
                                    selected_feature: selectedFeature
                                });
                                thePopup.setPosition(evt.coordinate);
                            } else {
                                thePopup.setPosition(undefined);
                                document.getElementById('popup-closer').blur();
                            }
                        })
                        .catch(function (error) {
                            console.log('Request failure: ', error);
                        });
                    break;
                }
            }
        });
    }

    render() {
        return (
            <div>
                <div id="popup" className="ol-popup">
                    <a href="#" id="popup-closer" className="ol-popup-closer" onClick={this.handleClose}></a>
                    <div id="popup-content">
                        {this.state.key && this.state.value ? (
                            <div style={{paddingLeft: '10px'}}>
                                <table>
                                    <tr>
                                        <td style={keyStyle}>Date</td>
                                        <td style={valueStyle}>{this.state.time}</td>
                                    </tr>
                                    <tr>
                                        <td style={keyStyle}>Latitude</td>
                                        <td style={valueStyle}>{this.state.latitude}</td>
                                    </tr>
                                    <tr>
                                        <td style={keyStyle}>Longitude</td>
                                        <td style={valueStyle}>{this.state.longitude}</td>
                                    </tr>
                                    <tr>
                                        <td style={keyStyle}>{this.state.key}</td>
                                        <td style={valueStyle}>{this.state.value.toFixed(10)}</td>
                                    </tr>
                                </table>
                                <div style={{padding: '10px 0px 0px 0px', textAlign: 'center'}}>
                                    <Tooltip placement="bottom" title={"Show charts for this grid"}>
                                        {/*
                                        <Button type="primary"
                                                shape="circle"
                                                icon="line-chart"
                                                onClick={this.showGridDiagrams}/>
                                        */}
                                        <Button type="primary"
                                                shape="round"
                                                size="small"
                                                icon="line-chart"
                                                onClick={this.showGridDiagrams}>
                                            <span style={{fontSize: '8pt'}}>
                                                Grid
                                            </span>
                                        </Button>

                                    </Tooltip>
                                    {
                                        this.state.watershed_id ? (
                                            <span style={{paddingLeft: '10px'}}>
                                                <Tooltip placement="bottom"
                                                         title={`Show charts for ${this.state.watershed_name}`}>
                                                    {/*
                                                    <Button type="primary"
                                                            shape="circle"
                                                            icon="area-chart"
                                                            onClick={this.showWatershedDiagrams} />
                                                    */}

                                                    <Button type="primary"
                                                            shape="round"
                                                            size="small"
                                                            icon="area-chart"
                                                            onClick={this.showWatershedDiagrams}>
                                                        <span style={{fontSize: '8pt'}}>
                                                            Basin
                                                        </span>
                                                    </Button>
                                                </Tooltip>
                                            </span>
                                        ) : null
                                    }
                                    {
                                        this.state.selected_feature ? (
                                            <span style={{paddingLeft: '10px'}}>
                                                <Tooltip placement="bottom"
                                                         title={`Show charts for this user defined spatial selection`}>
                                                    {/*
                                                    <Button type="primary"
                                                            shape="circle"
                                                            icon="fund"
                                                            onClick={this.showSelectedRegionDiagrams}/>
                                                     */}
                                                    <Button type="primary"
                                                            shape="round"
                                                            size="small"
                                                            icon="fund"
                                                            onClick={this.showSelectedRegionDiagrams}>
                                                        <span style={{fontSize: '8pt'}}>
                                                            Custom
                                                        </span>
                                                    </Button>
                                                </Tooltip>
                                            </span>
                                        ) : null
                                    }
                                </div>
                            </div>
                        ) : (
                            <div style={noDataStyle}>No data available</div>
                        )}
                    </div>
                </div>

                <Modal
                    title={
                        this.state.diagram_type === 'grid' ?
                            `Charts for The Grid at (${this.state.latitude}, ${this.state.longitude})`
                            :
                            this.state.diagram_type === 'watershed' ?
                                `Charts for ${this.state.watershed_name}`
                                :
                                `Charts for the user selected region`
                    }
                    visible={this.state.diagram_visible}
                    onOk={this.handleDiagramOk}
                    onCancel={this.handleDiagramCancel}
                >
                    {
                        this.state.diagram_type === 'grid' ? (
                                <WaterStorageGridDiagram
                                    latitude={this.state.latitude}
                                    longitude={this.state.longitude}
                                    ref={this.gridChart}
                                />
                            )
                            :
                            this.state.diagram_type === 'watershed' ?
                                (
                                    <WaterStorageWatershedDiagram
                                        watershed_id={this.state.watershed_id}
                                        ref={this.watershedChart}
                                    />
                                ) :
                                (
                                    <WaterStorageRegionDiagram
                                        selected_feature={this.state.selected_feature}
                                        ref={this.regionChart}
                                    />
                                )
                    }

                </Modal>

            </div>
        );
    }
}

export default WaterStoragePopover;



