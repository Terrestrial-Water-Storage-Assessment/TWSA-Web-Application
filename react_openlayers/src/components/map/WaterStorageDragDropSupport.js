import React from 'react';
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format';
import {DragAndDrop} from 'ol/interaction';
import {Vector as VectorLayer} from 'ol/layer';
import {XYZ, Vector as VectorSource} from 'ol/source';
import {Stroke, Style} from 'ol/style';
//import Select from 'ol/interaction/Select';
//import {click, pointerMove, altKeyOnly} from 'ol/events/condition';

class WaterStorageDragDropSupport extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        this.dragAndDropInteraction = new DragAndDrop({
            formatConstructors: [GeoJSON, KML]
        });

        this.props.map.addInteraction(this.dragAndDropInteraction);

        var theMap = this.props.map;
        this.dragAndDropInteraction.on('addfeatures', function (event) {

            var vectorSource = new VectorSource({
                features: event.features
            });

            var vectorLayer = new VectorLayer({
                source: vectorSource,
                style: new Style({
                    stroke: new Stroke({
                        color: 'green',
                        width: 2
                    }),
                })
            });
            vectorLayer.set("name", "dynamic-" + new Date().getTime())
            theMap.addLayer(vectorLayer);
            theMap.getView().fit(vectorSource.getExtent(), {padding: [50, 50, 50, 50]});

            /*
            var selectAltClick = new Select({
                layers: [vectorLayer],
                condition: function(mapBrowserEvent) {
                    return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
                }
            });

            theMap.addInteraction(selectAltClick);
            selectAltClick.on('select', function(e) {

            });
            */
        });
    }

    render() {
        return null;
    }

}

export default WaterStorageDragDropSupport;
