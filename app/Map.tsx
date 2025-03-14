import { ResizeObserver } from '@juggle/resize-observer';
import * as d3 from 'd3';
import { Venue } from './api/graphql/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Points from './Points';

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
  center: [number, number];
  features: GeoJSONFeature[];
}

interface MapProps {
  data: GeoJSON;
  points?: (Venue & { latitude: number; longitude: number })[];
  openVenues: number[];
  focusedVenue?: number;
}

const combineChartDimensions = (dimensions) => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop || 10,
    marginRight: dimensions.marginRight || 10,
    marginBottom: dimensions.marginBottom || 40,
    marginLeft: dimensions.marginLeft || 75,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  };
};

const useChartDimensions = (passedSettings) => {
  const ref = useRef(null);
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // @ts-expect-error
  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions];

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width !== entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height) setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [dimensions.width, dimensions.height, width, height]);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

const chartSettings = {
  marginLeft: 75,
};

const Map: React.FC<MapProps> = ({ data, points, openVenues, focusedVenue }) => {
  const [ref, dms] = useChartDimensions(chartSettings);
  const svgRef = useRef<SVGSVGElement>(null);

  const projection = useMemo(() => {
    const baseScale = 100000;
    const scaleFactor = Math.min(dms.width, dms.height) / 1000;
    const scale = baseScale * scaleFactor;
    return d3
      .geoMercator()
      .center([-75.1652, 39.9526])
      .scale(scale)
      .translate([dms.width / 2, dms.height / 2]);
  }, [dms.width, dms.height]);

  const pathGenerator = d3.geoPath(projection);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>('g');

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        const { transform } = event;
        g.attr('transform', transform.toString());
      });

    svg.call(zoom);
  }, [dms.width, dms.height]);

  return (
    <div ref={ref} style={{ height: '100vh' }}>
      <svg ref={svgRef} width={dms.width} height={dms.height}>
        <g>
          {data.features.map((feature) => (
            <path key={feature.properties.cartodb_id} d={pathGenerator(feature as any)} fill="#ddd" stroke="#333">
              <title>{feature.properties.name}</title>
            </path>
          ))}
          <Points points={points} projection={projection} openVenues={openVenues} focusedVenue={focusedVenue} />
        </g>
      </svg>
    </div>
  );
};

export default Map;
