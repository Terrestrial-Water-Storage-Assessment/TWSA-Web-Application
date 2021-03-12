import * as React from 'react';
import moment from 'moment';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {transform, transformExtent} from "ol/proj";
import config from '../../config';
import WaterStoragePopover from './WaterStoragePopover';
import WaterStorageLayerSwitch from './WaterStorageLayerSwitch';
import WaterStorageDateControlPanel from './WaterStorageDateControlPanel';
import WaterStorageLegend from './WaterStorageLegend';
import WaterStorageDragDropSupport from './WaterStorageDragDropSupport';
import WaterStorageMapCapture from "./WaterStorageMapCapture";
import WaterStorageMapVideo from "./WaterStorageMapVideo";

//import Stamen from 'ol/source/Stamen';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style, Text} from 'ol/style';

import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs(
    'EPSG:2163',
    '+proj=laea +lat_0=45 +lon_0=-100 +x_0=0 +y_0=0 ' +
    '+a=6370997 +b=6370997 +units=m +no_defs'
);
register(proj4);

export default class WaterStorageMap extends React.Component {

    constructor(props) {
        super(props);
        this.mapDivId = `map-${Math.random()}`;


        // this is a backup base map layer for Google Terrain Map
        /*
        this.backgroundLayer = new TileLayer({
            source: new Stamen({
                crossOrigin: "anonymous",
                layer: 'terrain'
            })
        });
         */

        this.backgroundLayer = new TileLayer({
            source: new XYZ({
                crossOrigin: "anonymous",
                url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}'
            })
        });

        var getMaxPoly = function (polys) {
            var polyObj = [];
            //now need to find which one is the greater and so label only this
            for (var b = 0; b < polys.length; b++) {
                polyObj.push({
                    poly: polys[b],
                    area: polys[b].getArea()
                });
            }
            polyObj.sort(function (a, b) {
                return a.area - b.area
            });

            return polyObj[polyObj.length - 1].poly;
        };

        var labelStyle = new Style({
            text: new Text({
                font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                overflow: false,
                fill: new Fill({
                    color: '#585858'
                }),
                stroke: new Stroke({
                    color: '#ffffff',
                    width: 2
                })
            }),
            geometry: function (feature) {
                var retPoint;
                if (feature.getGeometry().getType() === 'MultiPolygon') {
                    retPoint = getMaxPoly(feature.getGeometry().getPolygons()).getInteriorPoint();
                } else if (feature.getGeometry().getType() === 'Polygon') {
                    retPoint = feature.getGeometry().getInteriorPoint();
                }
                return retPoint;
            }
        });

        var watershedStyle = new Style({
            stroke: new Stroke({
                color: '#707070',
                width: 1
            })
        });

        var style = [watershedStyle, labelStyle];

        var styleFunc = function (feature, resolution) {
            //let watershedName = feature.get('reg_name');
            let watershedName = feature.get('NAME');
            labelStyle.getText().setText(
                //resolution > 10000 ? '' : watershedName
                watershedName
            );

            /*
            if (watershedName === 'South Atlantic Gulf') {
                labelStyle.getText().setOffsetY(-40);
                labelStyle.getText().setOffsetX(20);
            } else if (watershedName === 'North Atlantic-Appalachian') {
                labelStyle.getText().setOffsetY(10);
                labelStyle.getText().setOffsetX(0);
            } else {
                labelStyle.getText().setOffsetY(0);
                labelStyle.getText().setOffsetX(0);
            }
            */
            return style;
        }

        this.water_sheds_layer = new VectorLayer({
            source: new VectorSource({
                format: new GeoJSON(),
                crossOrigin: "anonymous",
                url: './data/WDBHU2.geojson'
            }),
            style: styleFunc,
            declutter: true
        })

        this.layers = [
            new OlLayerTile({
                visible: true,
                type: 'WMSTime',
                timeFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
                roundToFullHours: true,
                source: new OlSourceTileWMS({
                    url: config.twsa_cmwe_wms.url,
                    crossOrigin: "anonymous",
                    params: {
                        'LAYERS': config.twsa_cmwe_wms.cmwe_layer.name,
                        'TIME': config.twsa_cmwe_wms.cmwe_layer.init_time,
                    }
                })
            }),
            new OlLayerTile({
                visible: false,
                type: 'WMSTime',
                timeFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
                roundToFullHours: true,
                source: new OlSourceTileWMS({
                    url: config.twsa_cmwe_wms.url,
                    crossOrigin: "anonymous",
                    params: {
                        'LAYERS': config.twsa_cmwe_wms.precipitation_layer.name,
                        'TIME': config.twsa_cmwe_wms.precipitation_layer.init_time,
                    }
                })
            }),
            new OlLayerTile({
                visible: false,
                type: 'WMSTime',
                timeFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
                roundToFullHours: true,
                source: new OlSourceTileWMS({
                    url: config.twsa_cmwe_wms.url,
                    crossOrigin: "anonymous",
                    params: {
                        'LAYERS': config.twsa_cmwe_wms.evaporation_layer.name,
                        'TIME': config.twsa_cmwe_wms.evaporation_layer.init_time,
                    }
                })
            }),
            new OlLayerTile({
                visible: false,
                type: 'WMSTime',
                timeFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
                roundToFullHours: true,
                source: new OlSourceTileWMS({
                    url: config.twsa_cmwe_wms.url,
                    crossOrigin: "anonymous",
                    params: {
                        'LAYERS': config.twsa_cmwe_wms.runoff_layer.name,
                        'TIME': config.twsa_cmwe_wms.runoff_layer.init_time,
                    }
                })
            }),
        ];

        this.map = new OlMap({
            layers: [
                this.backgroundLayer,
                ...this.layers,
                this.water_sheds_layer,
            ],
            view: new OlView({
                projection: 'EPSG:2163',
                //center: transform([-97, 39], 'EPSG:4326', 'EPSG:3857'),
                center: transform([-97, 39], 'EPSG:4326', 'EPSG:2163'),
                extent: transformExtent([-131, 0, -61, 74], 'EPSG:4326', 'EPSG:2163'),
                zoom: 3.6
            })
        });
    }

    componentDidMount() {
        this.map.setTarget(this.mapDivId);
        //var extent = transformExtent([-129, 24, -65, 54], 'EPSG:4326', 'EPSG:3857');
        var extent = transformExtent([-131, 0, -61, 74], 'EPSG:4326', 'EPSG:2163');
        this.map.getView().fit(extent, {padding: [30, 100, 70, 100]});
    }

    render() {
        const tooltips = {
            setToNow: 'Set to now',
            //hours: 'Hourly',
            //days: 'Daily',
            weeks: 'Weekly',
            months: 'Monthly',
            years: 'Yearly',
            dataRange: 'Set data range'
        };

        return (
            <div style={{height: '100%'}}>
                <div id={this.mapDivId} style={{height: 'calc(100vh - 120px)'}}/>
                <WaterStoragePopover map={this.map} layers={this.layers}/>
                <WaterStorageLayerSwitch layers={this.layers} labelled={this.water_sheds_layer}/>
                <WaterStorageLegend layers={this.layers}/>
                <div style={{
                    padding: '5px 10px 8px 10px',
                    background: '#2e3842',
                    bottom: '0 !important',
                    height: '70px'
                }}>
                    <WaterStorageDateControlPanel
                        map={this.map}
                        initStartDate={moment(config.twsa_data_metadata.start_day, 'MM-DD-YYYY')}
                        initEndDate={moment(config.twsa_data_metadata.end_day, 'MM-DD-YYYY')}
                        timeAwareLayers={this.layers}
                        tooltips={tooltips}
                        autoPlaySpeedOptions={[]}
                    />
                </div>
                <WaterStorageDragDropSupport map={this.map}/>
                <WaterStorageMapCapture map={this.map}/>
                <WaterStorageMapVideo map={this.map}/>
            </div>
        )
    }
}


