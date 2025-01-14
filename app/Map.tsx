"use client"; // Mark the component as a client component for D3.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Venue } from "./api/graphql/types";

interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: Record<string, unknown>;
}

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

interface MapProps {
  data: GeoJSON;
  points?: (Venue & {latitude: number, longitude: number})[];
}

const Map: React.FC<MapProps> = ({ data, points = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    const projection = d3.geoMercator()
      .center([-75.1652, 39.9526]) // Philadelphia's longitude and latitude
      .scale(50000) // Adjust for proper zoom level
      .translate([width / 2, height / 2]);

    const path = d3.geoPath(projection);

    svg.attr("width", width).attr("height", height);

    // Draw map shapes
    svg.selectAll("path")
      .data(data.features)
      .join("path")
      .attr("d", path as any) // TypeScript may need casting here
      .attr("fill", "#ddd")
      .attr("stroke", "#333");

    // Draw points
    if (points.length) {
      svg.selectAll("circle")
        .data(points, (venue: Venue) => venue.id)
        .join("circle")
        .attr("cx", d => projection([d.longitude, d.latitude])![0])
        .attr("cy", d => projection([d.longitude, d.latitude])![1])
        .attr("r", 5)
        .attr("fill", "red")
        .call((venue) =>
          venue
            .append("title")
            .text((d) => `${d.name}`)
        );
    }
  }, [data, points]);

  return <svg ref={svgRef}></svg>;
};

export default Map;
