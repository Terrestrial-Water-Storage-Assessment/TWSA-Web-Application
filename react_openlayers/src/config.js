
export default {
    twsa_data_metadata: {
      start_day: "01-03-2007",
      end_day: "06-28-2017",
    },
    twsa_cmwe_wms: {
        //url: "//sauce5.sdsc.edu:8080/geoserver/twsa_cmwe/wms",
        url: "//twsa.ucsd.edu:8080/geoserver/twsa_cmwe/wms",
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        cmwe_layer: {
            name: "twsa_cmwe:twsa_cmwe",
            init_time: "2007-01-03T12:00:00.000Z",
        },
        precipitation_layer: {
            name: "twsa_cmwe:twsa_precipitation",
            init_time: "2007-01-03T12:00:00.000Z",
        },
        evaporation_layer:{
            name: "twsa_cmwe:twsa_evaporation",
            init_time: "2007-01-03T12:00:00.000Z",
        },
        runoff_layer:{
            name: "twsa_cmwe:twsa_runoff",
            init_time: "2007-01-03T12:00:00.000Z",
        }
    }
};