import React from 'react';
import {VideoCameraOutlined} from '@ant-design/icons';
import {transformExtent} from "ol/proj";
import moment from 'moment';
import {Modal, DatePicker, Button, Progress, Typography} from "antd";
import 'antd/dist/antd.css';

const {RangePicker} = DatePicker;
const {Title, Paragraph, Text} = Typography;

class WaterStorageMapCapture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            video_recorder_visible: false,
            video_start_date: moment(new Date(2017, 0, 1)),
            video_end_date: moment(new Date(2017, 5, 28)),
            video_record_tik: 0,
            is_recording: false
        };

        this.visibleLayer = null;
        this.mapCanvas = null;
        this.mapContext = null;
        this.visible_layer_name = 'twsa_map';
        this.mediaRecorder = null;
        this.videoAnimationId = null;
        this.videoStopRecordId = null;
        this.video_url = null;

        this.toggleHover = this.toggleHover.bind(this);
        this.makeMapVideo = this.makeMapVideo.bind(this);
        this.handleRecorderCancel = this.handleRecorderCancel.bind(this);
        this.handleRecorderOk = this.handleRecorderOk.bind(this);
        this.showVideoRecorder = this.showVideoRecorder.bind(this);
        this.onVideoDateRangeChanged = this.onVideoDateRangeChanged.bind(this);
        this.disabledDate = this.disabledDate.bind(this);
        this.increaseTik = this.increaseTik.bind(this);
    }

    toggleHover() {
        this.setState({hover: !this.state.hover})
    }

    handleRecorderOk(e) {
        this.setState({
            video_recorder_visible: false,
        });
    }

    handleRecorderCancel(e) {
        this.setState({
            video_recorder_visible: false,
        });

        if (this.state.is_recording === true) {
            window.clearInterval(this.videoAnimationId);
            window.clearTimeout(this.videoStopRecordId);

            this.setState({
                video_recorder_enforce_stop: true,
            }, () => {
                this.mediaRecorder.stop();
            });
        } else {
            this.setState({
                video_recorder_enforce_stop: false,
                video_record_tik: 0,
                is_recording: false
            });

            this.visibleLayer = null;
            this.mapCanvas = null;
            this.mapContext = null;
            this.visible_layer_name = 'twsa_map';
            this.mediaRecorder = null;
            this.videoAnimationId = null;
            this.videoStopRecordId = null;
        }

        let videoElement = document.querySelector("video");
        videoElement.pause();
        videoElement.removeAttribute('src'); // empty source
        videoElement.load();

    }

    showVideoRecorder(e) {

        const {detect} = require('detect-browser');
        const browser = detect();
        if (browser && browser.name === 'safari') {
            try {
                if (MediaRecorder) {
                }
            } catch (e) {
                Modal.info({
                    title: 'Please enable Safari MediaRecorder',
                    content: (
                        <table>
                            <tbody>
                            <tr>
                                <td style={{width: '15pt'}}>1.</td>
                                <td>Go to Safari → Preferences → Advanced</td>
                            </tr>
                            <tr>
                                <td style={{width: '15pt', verticalAlign: 'top'}}>2.</td>
                                <td style={{verticalAlign: 'top'}}>Enable the option “Show Develop menu in menu bar” at the bottom</td>
                            </tr>
                            <tr>
                                <td style={{width: '15pt'}}>3.</td>
                                <td>Go to Develop → Experimental Features</td>
                            </tr>
                            <tr>
                                <td style={{width: '15pt'}}>4.</td>
                                <td>Enable MediaRecorder</td>
                            </tr>
                            <tr>
                                <td style={{width: '15pt'}}>5.</td>
                                <td>Refresh this webpage</td>
                            </tr>
                            </tbody>
                        </table>
                    ),
                    onOk() {
                    },
                });
                return;
            }
        }

        this.setState({
            video_recorder_visible: true
        });
    }

    increaseTik() {
        this.setState({
            video_record_tik: this.state.video_record_tik + 1
        })
    }

    onVideoDateRangeChanged(dates) {
        //console.log(`${dates[0]}  ===  ${dates[1]}`);
        this.setState({
            video_start_date: dates[0],
            video_end_date: dates[1]
        });
    }

    disabledDate(date) {
        return (
            date < moment(new Date(2007, 0, 3)) ||
            date > moment(new Date(2017, 5, 28))
        );
    }

    drawMap(mapContext, mapCanvas, startDate) {

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

        // add logo
        let text = 'NASA/UCSD';
        mapContext.font = "32px verdana";
        mapContext.globalAlpha = .8;
        mapContext.fillStyle = 'black';
        let textWidth = mapContext.measureText(text).width;
        mapContext.fillText(text, width - textWidth - 40, height - 30);

        // add the date into the map
        mapContext.fillText(moment(startDate).format('MM/DD/YYYY'), 40, height - 30);
    }

    recordCanvas(visibleLayer, canvas, videoLength) {
        let thisState = this;
        let layer_name = this.visible_layer_name;
        let map = this.props.map;
        const recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(canvas.captureStream(25));
        this.mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
        this.mediaRecorder.onstop = () => {

            if (thisState.state.video_recorder_enforce_stop &&
                thisState.state.video_recorder_enforce_stop === true) {
                thisState.setState({
                    video_recorder_enforce_stop: false,
                    video_record_tik: 0,
                    is_recording: false
                });

                this.visibleLayer = null;
                this.mapCanvas = null;
                this.mapContext = null;
                this.visible_layer_name = 'twsa_map';
                this.mediaRecorder = null;
                this.videoAnimationId = null;
                this.videoStopRecordId = null;

            } else {

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

                const {detect} = require('detect-browser');
                const browser = detect();
                let video_type = "webm";
                if (browser && browser.name === 'safari') {
                    video_type = "mp4";
                }

                const url = URL.createObjectURL(
                    new Blob(recordedChunks, {type: `video/${video_type}`}));
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `${layer_name}_${extent_value}_${thisState.state.video_start_date.format('YYYY-MM-DD')}_${thisState.state.video_end_date.format('YYYY-MM-DD')}.${video_type}`;
                anchor.click();
                //window.URL.revokeObjectURL(url);

                var video = document.querySelector("video");
                video.src = url;
            }

            thisState.setState({
                is_recording: false
            });

            try {
                let time_value = document.getElementsByClassName("time-value")[0].innerHTML;
                let date = moment(time_value, 'YYYY-MM-DD');
                visibleLayer.getSource().updateParams({'TIME': date.toDate().toISOString()});
            } catch (e) {
                console.log(e.toString());
                console.trace();
            }
        }
        this.mediaRecorder.start();
        let mediaRecorder = this.mediaRecorder;
        this.videoStopRecordId = window.setTimeout(() => {
            mediaRecorder.stop();
        }, videoLength);
    }

    makeMapVideo() {
        this.setState({
            is_recording: true,
            video_record_tik: 0,
        });

        let videoElement = document.querySelector("video");
        videoElement.pause();
        videoElement.removeAttribute('src'); // empty source
        videoElement.load();

        let map = this.props.map;
        let layers = map.getLayers();
        let visibleLayer;
        let layer_name;
        try {
            layers.forEach(layer => {
                if (layer.getSource && layer.getSource().getParams && layer.getVisible()) {
                    visibleLayer = layer;
                    layer_name = layer.getSource().getParams().LAYERS.split(':')[1];
                }
            });
        } catch (e) {
        }

        this.visibleLayer = visibleLayer;
        this.visible_layer_name = layer_name;

        this.mapCanvas = document.createElement('canvas');
        var size = map.getSize();
        this.mapCanvas.width = size[0];
        this.mapCanvas.height = size[1];
        this.mapContext = this.mapCanvas.getContext('2d');

        let width = this.mapCanvas.width;
        let height = this.mapCanvas.height;

        let draw = this.drawMap;
        let increaseTik = this.increaseTik;
        let startDate = this.state.video_start_date.toDate();
        let endDate = this.state.video_end_date.toDate();
        let diff_weeks = moment(endDate).diff(moment(startDate), 'weeks');
        this.recordCanvas(this.visibleLayer, this.mapCanvas, 1000 * (diff_weeks + 1));
        this.drawMap(this.mapContext, this.mapCanvas, startDate);

        let mapConvas = this.mapCanvas;
        let mapContext = this.mapContext;
        let animationId = window.setInterval(function () {
            startDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            //console.log(`${startDate.toISOString()}`)
            visibleLayer.getSource().updateParams({'TIME': startDate.toISOString()});
            draw(mapContext, mapConvas, startDate);
            increaseTik();

            if (animationId !== null && startDate > endDate) {
                window.clearInterval(animationId);
                animationId = null;
            }
        }, 1000);

        this.videoAnimationId = animationId;

    }

    componentDidMount() {
        this.map = this.props.map;
    }

    render() {
        let rootStyle = this.props.style;
        if (rootStyle === undefined) {
            rootStyle = {
                position: 'absolute',
                top: '152px',
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
                    <VideoCameraOutlined onClick={this.showVideoRecorder} style={{color: 'white'}}/>
                </div>

                <Modal
                    title={"Map Video Recorder"}
                    visible={this.state.video_recorder_visible}
                    onOk={this.handleRecorderOk}
                    onCancel={this.handleRecorderCancel}
                    footer={[
                        <Button type="primary"
                                disabled={!(this.state.video_start_date && this.state.video_end_date) || this.state.is_recording}
                                onClick={this.makeMapVideo}>
                            Start Recording
                        </Button>,
                        <Button type="primary"
                                onClick={this.handleRecorderCancel}>
                            Cancel
                        </Button>,
                    ]}
                >

                    <div style={{width: '100%', padding: '0pt 10pt 3pt 10pt'}}>
                        <table border={0} style={{width: '100%'}}>
                            <tbody>
                            <tr>
                                <td style={{textAlign: 'center'}}>
                                    <video autoPlay controls
                                           controlsList={"nodownload"}
                                           width={420}
                                           height={200}
                                           style={{backgroundColor: 'gray'}}></video>
                                </td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', paddingTop: '10pt', paddingBottom: '5pt'}}>
                                    <RangePicker
                                        defaultValue={[this.state.video_start_date, this.state.video_end_date]}
                                        onCalendarChange={this.onVideoDateRangeChanged}
                                        onChange={this.onVideoDateRangeChanged}
                                        disabledDate={this.disabledDate}
                                        disabled={this.state.is_recording === true}
                                    />
                                </td>
                            </tr>
                            {
                                this.state.video_start_date && this.state.video_end_date ?
                                    <tr>
                                        <td style={{padding: '5pt 30pt 0pt 40pt', textAlign: 'center'}}>
                                            <Progress
                                                percent={Math.round(this.state.video_record_tik * 100 / this.state.video_end_date.diff(this.state.video_start_date, 'weeks'))}/>
                                            <Typography>
                                                <Text>
                                                    Time to record video:
                                                </Text>
                                                <Text style={{padding: '0pt 5pt 0pt 5pt'}}>
                                                    {
                                                        this.state.video_end_date.diff(this.state.video_start_date, 'weeks')
                                                        -
                                                        (this.state.is_recording ? this.state.video_record_tik : 0)
                                                    }
                                                </Text>
                                                <Text>
                                                    seconds
                                                </Text>
                                            </Typography>
                                        </td>
                                    </tr> : null
                            }
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>

        );
    }
}

export default WaterStorageMapCapture;
