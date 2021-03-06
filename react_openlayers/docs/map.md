# Basic Map

The Basic Map component setup a map interface for TWAS data. The initial map extent
is USA. 

##For end users
- The background layer: Google Terrain Map _(visible)_
- Four Data layers and their visibilities at beginning:

  - CMWE _(visible)_
  - Pricipitation _(invisible)_
  - Evaporation _(invisible)_
  - Runoff _(invisible)_
  
- The top layer: USA watershed based unified regions _(visible)_

##For developers

You can setup a basic map by importing `WaterStorageBasicMap` and give it a CSS style as 
`mapStyle`
.

```javascript
import WaterStorageBasicMap from '../src/components/map/WaterStorageBasicMap';

export const myMap = () =>
   <div style={{padding: '20px'}}>
       <WaterStorageBasicMap mapStyle={{width: '400px', height: '300px'}}/>
   </div>
;
```

The map on the canvas was generated by using this code.