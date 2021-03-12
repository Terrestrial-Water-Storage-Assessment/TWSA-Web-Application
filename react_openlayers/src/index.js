import React from "react";
import ReactDOM from "react-dom";
import Header from './components/header/Header';
import WaterStorageMap from './components/map/WaterStorageMap';

ReactDOM.render(<Header/>, document.getElementById("header"));
ReactDOM.render(<WaterStorageMap/>, document.getElementById("map"));

