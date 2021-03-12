import React from 'react';
import {CameraOutlined} from '@ant-design/icons';
import {transformExtent} from "ol/proj";

class WaterStorageMapCapture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
        this.downloadMap = this.downloadMap.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
    }

    toggleHover() {
        this.setState({hover: !this.state.hover})
    }

    downloadMap() {
        let map = this.props.map;
        map.once('rendercomplete', function () {
            var mapCanvas = document.createElement('canvas');
            var size = map.getSize();
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            var mapContext = mapCanvas.getContext('2d');

            let width = mapCanvas.width;
            let height = mapCanvas.height;

            Array.prototype.forEach.call(
                document.querySelectorAll('.ol-layer canvas'),
                function (canvas) {
                    if (canvas.width > 0) {
                        var opacity = canvas.parentNode.style.opacity;
                        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                        var transform = canvas.style.transform;
                        // Get the transform parameters from the style's transform matrix
                        var matrix = transform
                            .match(/^matrix\(([^\(]*)\)$/)[1]
                            .split(',')
                            .map(Number);
                        // Apply the transform to the export map context
                        CanvasRenderingContext2D.prototype.setTransform.apply(
                            mapContext,
                            matrix
                        );
                        mapContext.drawImage(canvas, 0, 0);

                        width = Math.max(width, canvas.clientWidth);
                        height = Math.max(height, canvas.clientHeight);
                    }
                }
            );
            //console.log(`width: ${width}, height: ${height}`);

            let text = 'NASA/UCSD';
            mapContext.font = "32px verdana";
            mapContext.globalAlpha = .8;
            mapContext.fillStyle = 'black';
            let textWidth = mapContext.measureText(text).width;
            mapContext.fillText(text, width - textWidth - 40, height - 30);

            let layers = map.getLayers();
            let layer_name = 'twsa_map';
            try {
                layers.forEach(layer => {
                    if (layer.getSource && layer.getSource().getParams && layer.getVisible()) {
                        //console.log(`layer: ${layer.getSource().getParams().LAYERS.split(':')[1]}`);
                        layer_name = layer.getSource().getParams().LAYERS.split(':')[1];
                    }
                });
            } catch (e) {
            }

            let time_value = new Date().getTime();
            try {
                time_value = document.getElementsByClassName("time-value")[0].innerHTML;
                //console.log(`date: ${time_value}`);
            } catch (e) {
            }

            let extent_value = '-129,24,-65,54';
            try {
                let extent = map.getView().calculateExtent(map.getSize());
                extent = transformExtent(extent, 'EPSG:2163', 'EPSG:4326');
                extent_value =
                    extent[0].toFixed(2) + "," +
                    extent[1].toFixed(2) + "," +
                    extent[2].toFixed(2) + "," +
                    extent[3].toFixed(2);
                //console.log(`extent: ${extent}`);
                //console.log(`extent: ${extent_value}`);
            } catch (e) {
            }

            let filename = `${layer_name}_${time_value}_${extent_value}.png`;
            if (navigator.msSaveBlob) {
                // link download attribute does not work on MS browsers
                navigator.msSaveBlob(mapCanvas.msToBlob(), filename);
            } else {
                var link = document.getElementById('image-download');
                link.download = filename;
                link.href = mapCanvas.toDataURL();
                link.click();
            }
        });
        map.renderSync();
    }

    componentDidMount() {
        this.map = this.props.map;
        if (this.map === undefined) {
            console.log("in WaterStorageMapCapture: no map was given");
        } else {
            //console.log("in WaterStorageMapCapture: map was given");
        }
    }

    render() {
        let rootStyle = this.props.style;
        if (rootStyle === undefined) {
            rootStyle = {
                position: 'absolute',
                top: '126px',
                left: '7px',
                padding: '1px 4px 1px 4px',
                borderRadius: '6px',
                backgroundColor: this.state.hover ? 'rgba(0, 60, 136, .8)' : 'rgba(0, 60, 136, .5)',
                border: '3px solid rgba(255, 255, 255, 0.72)',
            };
        }

        return (
            <div>
                <div style={rootStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                    <CameraOutlined onClick={this.downloadMap} style={{color: 'white'}}/>
                    <a id="image-download" download="map.png"></a>
                </div>
            </div>

        );
    }
}

export default WaterStorageMapCapture;
