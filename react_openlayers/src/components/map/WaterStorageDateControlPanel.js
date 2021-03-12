
import {TimeLayerSliderPanel} from '@terrestris/react-geo';
import './water_storage_date_control_panel.css';

export default class WaterStorageDateControlPanel extends TimeLayerSliderPanel {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({
            value: this.props.initStartDate.milliseconds(0),
            playbackSpeed: 'weeks',
            autoPlayActive: false,
            startDate: this.props.initStartDate.milliseconds(0),
            endDate: this.props.initEndDate.milliseconds(0)
        });

        this.wmsTimeHandler(this.props.initStartDate.milliseconds(0));

        var playSpeedElement =
            document.getElementsByClassName("ant-select-selection-selected-value")[0];
        playSpeedElement.innerHTML = "weeks";

        // update time value
        var timeValueElement = document.getElementsByClassName("time-value")[0];

        // create an observer instance
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var timeValue = mutation.target.nodeValue;
                if (timeValue && timeValue.indexOf(" ") != -1) {
                    var timeElements = timeValue.split(" ")[0].split(".");
                    timeValueElement.innerHTML = timeElements[2] + "-" + timeElements[1] + "-" + timeElements[0];
                }
            });
        });

        // configuration of the observer:
        var config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree:true
        }

        // pass in the target node, as well as the observer options
        observer.observe(timeValueElement, config);

    }
}