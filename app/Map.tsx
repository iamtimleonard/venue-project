import { ResizeObserver } from '@juggle/resize-observer'
import * as d3 from "d3"
import { Venue } from "./api/graphql/types";
import React, { useEffect, useRef, useState } from "react";
import Points from "./Points";

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

const combineChartDimensions = dimensions => {
  const parsedDimensions = {
      ...dimensions,
      marginTop: dimensions.marginTop || 10,
      marginRight: dimensions.marginRight || 10,
      marginBottom: dimensions.marginBottom || 40,
      marginLeft: dimensions.marginLeft || 75,
  }
  return {
      ...parsedDimensions,
      boundedHeight: Math.max(
        parsedDimensions.height
        - parsedDimensions.marginTop
        - parsedDimensions.marginBottom,
        0,
      ),
      boundedWidth: Math.max(
        parsedDimensions.width
        - parsedDimensions.marginLeft
        - parsedDimensions.marginRight,
        0,
      ),
  }
}

const useChartDimensions = passedSettings => {
  const ref = useRef(null)
  const dimensions = combineChartDimensions(
    passedSettings
  )

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  // @ts-expect-error
  useEffect(() => {
      if (dimensions.width && dimensions.height)
        return [ref, dimensions]

      const element = ref.current
      const resizeObserver = new ResizeObserver(
        entries => {
          if (!Array.isArray(entries)) return
          if (!entries.length) return

          const entry = entries[0]

          if (width != entry.contentRect.width)
            setWidth(entry.contentRect.width)
          if (height != entry.contentRect.height)
            setHeight(entry.contentRect.height)
        }
      )
      resizeObserver.observe(element)

      return () => resizeObserver.unobserve(element)
  }, [])

  const newSettings = combineChartDimensions({
      ...dimensions,
      width: dimensions.width || width,
      height: dimensions.height || height,
  })

  return [ref, newSettings]
}

const chartSettings = {
  "marginLeft": 75
}

const Map: React.FC<MapProps> = ({ data, points }) => {
  const [ref, dms] = useChartDimensions(chartSettings)
  const projection = d3.geoMercator().center([-75.1652, 39.9526]).scale(100000).translate([dms.width / 2, dms.height / 2])
  const pathGenerator = d3.geoPath(projection)

  const [
    [x0, y0],
    [x1, y1]
  ] = pathGenerator.bounds({ type: "Sphere" })
  const height = y1

  return (<div ref={ref} style={{ height: "1000px"}}>
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
        <Points points={points} projection={projection} />
    </svg>
  </div>)
}

export default Map
