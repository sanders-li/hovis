import React from 'react'
import axios from 'axios'
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import {StaticMap} from 'react-map-gl';

import Tooltip from '../Tooltip/Tooltip'

const key = require('./keys.json').mapbox

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -95,
    latitude: 37,
    zoom: 4,
    pitch: 0,
    bearing: 0
};
  
const rg_gradient = (percent) => {
    let percent_clamped = Math.min(Math.max(percent, 0), 1);
    let r, g;
    if (percent_clamped < 0.5) {
        r = (percent_clamped)/0.5; g = 1;
    } else if (percent_clamped > 0.5) {
        r = 1; g = (percent_clamped-0.5)/0.5
    } else {
        r = 1; g = 1;
    }
    return [255 * r, 255 * g, 0]
}

function Map({ sourceData, collection_week }) {
    //const [hoverInfo, setHoverInfo] = useState;
    // Use useEffect instead?
    /*
    {hoverInfo.object && (
        <div style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <Tooltip object={hoverInfo.object} />
        </div>
    )}
    */

    let layers = [
        new ScatterplotLayer({
            id: 'scatter',
            data: sourceData[collection_week],
            opacity: 0.8,
            filled: true,
            radiusMinPixels: 3,
            radiusMaxPixels: 5,
            getPosition: d => [d.lng, d.lat],
            getFillColor: d => rg_gradient(d.inpatient_occupancy),
          
            pickable: true,
            // onHover: info => setHoverInfo(info)
        })
    ];

    return (
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
        >
          <StaticMap mapboxApiAccessToken={key} />
        </DeckGL>
    )
}

export default Map;