import React from 'react';
import WaterStorageBasicMap from '../backup/WaterStorageBasicMap';
import WaterStorageLayerSwitch from '../src/components/map/WaterStorageLayerSwitch';
import WaterStorageLegend from '../src/components/map/WaterStorageLegend';
import WaterStorageGridDiagram from "../src/components/map/WaterStorageGridDiagram";
import WaterStorageWatershedDiagram from "../src/components/map/WaterStorageWatershedDiagram";
import '../src/css/ol.css';

import mapNotes from './map.md';
import mapLayerSwitchNotes from './layerSwitch.md';
import mapLegendNotes from './legend.md';
import chartsForGridNotes from './chartsForGrid.md';
import chartsForRegionNotes from './chartsForRegion.md';
import WaterStoragePopover from "../src/components/map/WaterStoragePopover";

export default {
    title: 'Components',
};

/////////////////////////////////////////////////
//
// story of basic map
//
/////////////////////////////////////////////////


export const basicMap = () =>
    <div style={{padding: '20px 20px 20px 20px'}}>
        <WaterStorageBasicMap mapStyle={{width: '400px', height: '300px'}}/>
    </div>;

basicMap.story = {
    parameters: {notes: mapNotes},
}

/////////////////////////////////////////////////
//
// story of map layer switch
//
/////////////////////////////////////////////////
export const layerSwitch = () => {
    const mapRef = React.createRef();
    return (
        <div style={{padding: '20px 20px 20px 20px'}}>
            <WaterStorageBasicMap
                mapStyle={{width: '400px', height: '300px', float: 'left'}}
                ref={mapRef}
            />
            <div style={{paddingLeft: '5px', display: 'table', clear: 'right'}}>
                <WaterStorageLayerSwitch
                    mapRef={mapRef}
                    style={{
                        width: '120px',
                        padding: '10px 5px 10px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16,16,16,0.8)'
                    }}
                />
            </div>
        </div>
    );
}

layerSwitch.story = {
    parameters: {notes: mapLayerSwitchNotes},
}

/////////////////////////////////////////////////
//
// story of map legend
//
/////////////////////////////////////////////////

export const mapLegend = () => {
    const mapRef = React.createRef();
    return (
        <div style={{padding: '20px 20px 20px 20px'}}>
            <WaterStorageBasicMap
                mapStyle={{width: '400px', height: '300px', float: 'left'}}
                ref={mapRef}
            />
            <div style={{paddingLeft: '5px', display: 'table', clear: 'right'}}>
                <WaterStorageLayerSwitch
                    mapRef={mapRef}
                    style={{
                        width: '120px',
                        padding: '10px 5px 10px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16,16,16,0.8)'
                    }}
                />
                <WaterStorageLegend
                    mapRef={mapRef}
                    style={{}}
                />
            </div>
        </div>
    )
}

mapLegend.story = {
    parameters: {notes: mapLegendNotes},
}

/////////////////////////////////////////////////
//
// story of grid charts
//
/////////////////////////////////////////////////

export const chartsForGrid = () => {
    return (
        <div style={{padding: '20px', width:'600px', height:'500px'}}>
            <div style={{textAlign: 'center'}}>
                <h3>Charts for The Grid at (49.25, -19.25)</h3>
            </div>
            <WaterStorageGridDiagram
                latitude={49.25}
                longitude={-91.25}
            />
        </div>
    )
}

chartsForGrid.story = {
    parameters: {notes: chartsForGridNotes},
}

/////////////////////////////////////////////////
//
// story of watershed charts
//
/////////////////////////////////////////////////

export const chartsForRegion = () => {
    return (
        <div style={{padding: '20px', width:'600px', height:'500px'}}>
            <div style={{textAlign: 'center'}}>
                <h3>Charts for California-Great Basin</h3>
            </div>
            <WaterStorageWatershedDiagram watershed_id={10}/>
        </div>
    )
}

chartsForRegion.story = {
    parameters: {notes: chartsForRegionNotes},
}

/////////////////////////////////////////////////
//
// story of map popover
//
/////////////////////////////////////////////////

{/*
export const mapPopover = () => {
    const mapRef = React.createRef();
    return (
        <div style={{padding: '20px 20px 20px 20px'}}>
            <WaterStorageBasicMap
                mapStyle={{width: '400px', height: '300px', float: 'left'}}
                ref={mapRef}
            />
            <WaterStoragePopover mapRef={mapRef} />
            <div style={{paddingLeft: '5px', display: 'table', clear: 'right'}}>
                <WaterStorageLayerSwitch
                    mapRef={mapRef}
                    style={{
                        width: '120px',
                        padding: '10px 5px 10px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16,16,16,0.8)'
                    }}
                />
            </div>
        </div>
    );

}

mapPopover.story = {
    parameters: {notes: chartsForRegionNotes},
}
*/}