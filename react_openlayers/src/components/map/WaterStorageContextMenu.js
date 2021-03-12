
import React from 'react';
import ContextMenu from 'ol-contextmenu';

class WaterStorageContextMenu extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var contextmenu = new ContextMenu({
            width: 300,
            defaultItems: false,
            items: [
                {
                    text: 'Show Diagrams for This Grid',
                },
                {
                    text: 'Show Diagrams for This Water Shed',
                },
            ]
        });
        this.props.map.addControl(contextmenu);

        var theMap = this.props.map;
        contextmenu.on('open', function(evt) {
            document.getElementById('popup-closer').blur();
        });
    }

    render() {
        return null;
    }
}

export default WaterStorageContextMenu;