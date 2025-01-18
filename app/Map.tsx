import * as d3 from "d3"
import { Venue } from "./api/graphql/types";
import React from "react";

interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: Record<string, string>;
}

interface GeoJSON {
  type: string;
  center: [number, number]
  features: GeoJSONFeature[];
}

interface MapProps {
  data: GeoJSON;
  points?: (Venue & {latitude: number, longitude: number})[];
}

const Map: React.FC<MapProps> = ({ data, points }) => {
  const dms = { width: 2400, height: 1800 }
  const projection = d3.geoMercator().center([-75.1652, 39.9526]).scale(150000).translate([dms.width / 2, dms.height / 2])
  const pathGenerator = d3.geoPath(projection)

  const [
    [x0, y0],
    [x1, y1]
  ] = pathGenerator.bounds({ type: "Sphere" })
  const height = y1

  return (<div>
    <svg 
      width={dms.width} 
      height={dms.height}>
        {data.features.map((feature) => (
          <path key={feature.properties.cartodb_id} 
            d={pathGenerator(feature as any)} fill='#ddd' 
            stroke="#333" >
              <title>{feature.properties.name}</title>
          </path>
        ))}
        {points.map((venue) => {
          console.log(venue)
          return (
          <circle 
            cx={projection([venue.longitude, venue.latitude])[0]} 
            cy={projection([venue.longitude, venue.latitude])[1]} 
            key={venue.id} 
            r={5} 
            fill="red">
              <title>{venue.name}</title>
            </circle>
        )})}
    </svg>
  </div>)
}

export default Map
