# Map Layer Switch

The Layer Switch component provides the ability to show different data layer on the 
basic map. 

##For end users
- By default, the CMWE layer was visible. 
- Click on a radio button can make the associated data layer visible.

##For developers

The following code shows the way of binding a map switch to a basic map.

```javascript
import React from 'react';
import WaterStorageBasicMap from '../src/components/map/WaterStorageBasicMap';
import WaterStorageLayerSwitch from '../src/components/map/WaterStorageLayerSwitch';

export const myMap = () => {
    const mapRef = React.createRef();
    return (
        <div style={{padding: '20px'}}>
            <WaterStorageBasicMap
                mapStyle={{width: '400px', height: '300px', float: 'left'}}
                ref={mapRef}
            />
            <div style={{paddingLeft: '5px', display: 'table', clear: 'right'}}>
                <WaterStorageLayerSwitch
                    mapRef={mapRef}
                    style={{
                        width: '140px',
                        padding: '10px 5px 10px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16,16,16,0.8)'
                    }}
                />
            </div>
        </div>
    );
}
```

The map on the canvas was generated by this code.