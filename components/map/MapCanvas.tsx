"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { TravelPlan } from "@/lib/types";
import "leaflet/dist/leaflet.css";

type MapCanvasProps = {
  plan: TravelPlan;
};

const dayColors: Record<number, string> = {
  1: "#60a5fa",
  2: "#fb923c"
};

const travelColor = "#22d3ee";

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

export function MapCanvas({ plan }: MapCanvasProps) {
  useEffect(() => {
    // Ensure default marker icons load correctly when bundling with Next.js
    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = icon;
  }, []);

  const origin = plan.parsed.originCity
    ? {
        name: plan.parsed.originCity.name,
        lat: plan.parsed.originCity.lat,
        lng: plan.parsed.originCity.lng
      }
    : {
        name: plan.parsed.originFallback ?? "Origin City",
        lat: 28.6139,
        lng: 77.209
      };

  const destination = plan.parsed.destinationCity
    ? {
        name: plan.parsed.destinationCity.name,
        lat: plan.parsed.destinationCity.lat,
        lng: plan.parsed.destinationCity.lng
      }
    : {
        name: plan.parsed.destinationFallback ?? "Destination",
        lat: 35.6764,
        lng: 139.65
      };

  const dayGroups = [1, 2].map((day) =>
    plan.itinerary
      .filter((item) => item.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  );

  const bounds = useMemo<L.LatLngBoundsExpression>(() => {
    const points: [number, number][] = [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng]
    ];
    plan.itinerary.forEach((item) => {
      points.push([item.attraction.lat, item.attraction.lng]);
    });
    return points.length > 0 ? points : [[0, 0]];
  }, [destination.lat, destination.lng, destination.name, origin.lat, origin.lng, plan.itinerary]);

  return (
    <MapContainer
      className="h-[32rem] w-full rounded-3xl border border-slate-800 shadow-card"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds bounds={bounds} />

      <Polyline
        positions={[
          [origin.lat, origin.lng],
          [destination.lat, destination.lng]
        ]}
        pathOptions={{ color: travelColor, weight: 4, dashArray: "6 10" }}
      />
      <Marker position={[origin.lat, origin.lng]}>
        <Popup>
          <div className="text-sm">
            <div className="font-semibold">{origin.name}</div>
            <div>
              Depart {plan.selectedTransport.departureTime} •{" "}
              {plan.selectedTransport.provider}
            </div>
          </div>
        </Popup>
      </Marker>
      <Marker position={[destination.lat, destination.lng]}>
        <Popup>
          <div className="text-sm">
            <div className="font-semibold">{destination.name}</div>
            <div>Arrival {plan.selectedTransport.arrivalTime}</div>
          </div>
        </Popup>
      </Marker>

      {dayGroups.map((items, index) => {
        if (items.length === 0) return null;
        const color = dayColors[index + 1];
        const coordinates = items.map((item) => [item.attraction.lat, item.attraction.lng]) as [number, number][];
        coordinates.unshift([destination.lat, destination.lng]);

        return (
          <Polyline
            key={index}
            positions={coordinates}
            pathOptions={{ color, weight: 4, opacity: 0.85 }}
          />
        );
      })}

      {plan.itinerary.map((item) => (
        <Marker
          key={item.id}
          position={[item.attraction.lat, item.attraction.lng]}
        >
          <Popup>
            <div className="text-sm">
              <div className="text-xs uppercase tracking-widest text-slate-400">
                Day {item.day} • {item.startTime} – {item.endTime}
              </div>
              <div className="font-semibold">{item.attraction.name}</div>
              <div className="text-xs text-slate-500">
                {item.attraction.description}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
