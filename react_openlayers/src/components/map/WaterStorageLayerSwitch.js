import React from 'react';
import {Radio, Divider, Checkbox} from 'antd';
import config from '../../config';
import './water_storage_layer_switch.css';

class WaterStorageLayerSwitch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data_category: config.twsa_cmwe_wms.cmwe_layer.name,
            layers: this.props.layers,
            labelled_layer: this.props.labelled,
            show_watersheds: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            data_category: event.target.value
        });
        if (this.state.layers) {
            for (var i = 0; i < this.state.layers.length; i++) {
                var layer = this.state.layers[i];
                layer.setVisible(layer.getSource().getParams().LAYERS === event.target.value);
            }
        }
    }

    handleLabelChange(event) {
        this.setState({
            show_watersheds: event.target.checked
        })
        this.state.labelled_layer.setVisible(event.target.checked);
    }

    componentDidMount() {
        if (this.props.mapRef && this.props.mapRef.current) {
            this.setState({
                layers: this.props.mapRef.current.getLayers()
            });
        }
    }

    render() {
        let rootStyle = this.props.style;
        if (rootStyle === undefined) {
            rootStyle = {
                position: 'absolute',
                top: '70px',
                right: '8px',
                padding: '10px 5px 10px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16,16,16,0.8)',
            };
        }

        const radioStyle = {
            display: 'block',
            height: '20px',
            lineHeight: '20px',
        };

        return (
            <div style={rootStyle}>
                <Radio.Group onChange={this.handleChange} value={this.state.data_category}>
                    <Radio style={radioStyle} value={config.twsa_cmwe_wms.cmwe_layer.name}>
                        CMWE
                    </Radio>
                    <Radio style={radioStyle} value={config.twsa_cmwe_wms.precipitation_layer.name}>
                        Precipitation
                    </Radio>
                    <Radio style={radioStyle} value={config.twsa_cmwe_wms.evaporation_layer.name}>
                        Evaporation
                    </Radio>
                    <Radio style={radioStyle} value={config.twsa_cmwe_wms.runoff_layer.name}>
                        Runoff
                    </Radio>
                </Radio.Group>
                <div style={{padding: '8px 0px 8px 0px'}}>
                    <Divider/>
                </div>
                <Checkbox onChange={this.handleLabelChange} checked={this.state.show_watersheds}>
                    Drainage Basins
                </Checkbox>
            </div>
        );
    }
}

export default WaterStorageLayerSwitch;
