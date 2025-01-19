import { Venue } from "./api/graphql/types"

const Points: React.FC<{ points: (Venue & { latitude: number, longitude: number})[], projection: any}> = ({points, projection}) => points.map((venue) => {
  return (
    <circle 
      cx={projection([venue.longitude, venue.latitude])[0]} 
      cy={projection([venue.longitude, venue.latitude])[1]} 
      key={venue.id} 
      r={5} 
      fill="red">
      <title>{venue.name}</title>
    </circle>
)})

export default Points