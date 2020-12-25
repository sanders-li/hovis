import React from 'react';

import './Controls.css'

export default class Controls extends React.Component {
    render() {
        return (
            <div id="controls">
                <div id="data_types">
                    <button id='inpatient_toggle'>Inpatient</button>
                    <button id='icu_toggle'>ICU</button>
                    <button id='covid_toggle'>COVID</button>
                </div>
                <div id="visualization">
                    <button id='facilities_toggle'>Facilities</button>
                    <button id='heatmap_toggle'>Heatmap</button>
                    <button id='hexagon_toggle'>Hexagons</button>
                </div>
            </div>
        )
    }
}