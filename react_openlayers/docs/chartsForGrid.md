# Charts For Grid

The Charts For Grid component displays line charts for the data at the grid with 
specific latitude and longitude. In the application, this chart is displayed by
a button in the map popover.

##For developers

You can setup a map legend by importing `WaterStorageGridDiagram`:
.

```javascript
import WaterStorageGridDiagram from "../src/components/map/WaterStorageGridDiagram";

export const myCharts = () => {
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
```

The map on the canvas was generated by using this code. 