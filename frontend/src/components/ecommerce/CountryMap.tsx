import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"

      /* Focus précis sur Abidjan */
      focusOn={{
        lat: 5.347,
        lng: -4.024,
        scale: 6.5,
        animate: true,
      }}

      zoomOnScroll={false}
      zoomMax={10}
      zoomMin={4}
      zoomAnimate={true}

      /* Côte d'Ivoire en évidence (sans interaction inutile) */
      regionsSelectable={false}
      selectedRegions={["CI"]}

      /* Communes d'Abidjan */
      markers={[
        // Centre d'Abidjan (marker principal)
        {
          latLng: [5.347, -4.024],
          name: "Abidjan",
          style: {
            r: 7,
            fill: "#1E40FF",
            stroke: "#ffffff",
            strokeWidth: 2,
          },
        },

        { latLng: [5.4167, -4.0167], name: "Abobo" },
        { latLng: [5.3739, -4.0206], name: "Adjamé" },
        { latLng: [5.3364, -4.0317], name: "Attécoubé" },
        { latLng: [5.3556, -3.8850], name: "Bingerville" },
        { latLng: [5.3600, -3.9990], name: "Cocody" },
        { latLng: [5.2945, -3.9543], name: "Koumassi" },
        { latLng: [5.3081, -3.9814], name: "Marcory" },
        { latLng: [5.3220, -4.0176], name: "Plateau" },
        { latLng: [5.2540, -3.9269], name: "Port-Bouët" },
        { latLng: [5.2956, -4.0208], name: "Treichville" },
        { latLng: [5.3531, -4.0619], name: "Yopougon" },
        { latLng: [5.4940, -4.0507], name: "Anyama" },
        { latLng: [5.3473, -4.2257], name: "Songon" },
      ]}

      markerStyle={{
        initial: {
          fill: "#465FFF",
          r: 4,
          stroke: "#ffffff",
          strokeWidth: 1,
        } as any,
        hover: {
          fill: "#1E40FF",
          cursor: "pointer",
        },
      }}

      /* Styles carte */
      regionStyle={{
        initial: {
          fill: mapColor || "#F3F4F6",
          fillOpacity: 1,
          stroke: "none",
        },
        hover: {
          fillOpacity: 0.4,
        },
        selected: {
          fill: "#E0E7FF",
        },
      }}

      regionLabelStyle={{
        initial: {
          fill: "#111827",
          fontSize: "12px",
          fontWeight: 500,
          stroke: "none",
        },
      }}
    />
  );
};

export default CountryMap;
