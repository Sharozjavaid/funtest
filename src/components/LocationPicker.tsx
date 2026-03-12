"use client";

import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Location } from "@/types";

interface LocationPickerProps {
  onLocationSelect: (location: Location | null) => void;
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const { position, error, loading, requestPosition } = useGeolocation();
  const [name, setName] = useState("");

  function handleUseLocation() {
    if (!position) {
      requestPosition();
      return;
    }
    if (name.trim()) {
      onLocationSelect({ lat: position.lat, lng: position.lng, name: name.trim() });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        id="location-name"
        label="Location Name"
        placeholder="Central Park Dog Run"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleUseLocation}
        disabled={loading}
      >
        {loading
          ? "Getting location..."
          : position
            ? "Set Location"
            : "Use My Location"}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {position && !name && (
        <p className="text-xs text-bark-light">
          Got coordinates — enter a name above, then click &quot;Set Location&quot;
        </p>
      )}
    </div>
  );
}
