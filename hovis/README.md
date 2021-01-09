# Hospital Occupancy Visualizer - Web Application

[Demo Link](hovis.surge.sh)

## Usage

1. Clone repository
2. Install the necessary modules via `npm init`
4. Add json data `./public/`
5. Run `npm start`

## Mapbox Option

To use Mapbox Basemap instead of CARTO: 

- Create an `.env` file in the `./src` directory with the following format
   > `MAPBOX_TOKEN = //insert your token here`
- Switch `StaticMap` JSX to utilize mapbox
   > `<StaticMap mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} mapStyle="mapbox://styles/mapbox/dark-v10" />`
- Include Mapbox required JS and CSS files in `./public/index.html`:
   > `<script src='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js'></script>`  
   > `<link href='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />`