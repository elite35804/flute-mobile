export const latlng = (loc) => {
  if (!loc) return { lat: 0, lon: 0 };
  if (loc.coordinates && loc.coordinates.length) {
    return { lat: loc.coordinates[1], lon: loc.coordinates[0] };
  }
  if (loc.coords && loc.coords.latitude) {
    return { lat: loc.coords.latitude, lon: loc.coords.longitude };
  }
  if (loc.latitude) {
    return { lat: loc.latitude, lon: loc.longitude };
  }
  if (loc.lon) {
    return { lat: loc.lat, lon: loc.lon };
  }
  return loc;
};

export const latlng2 = (loc) => {
  if (!loc) return {};
  const loc2 = latlng(loc);
  return { latitude: loc2.lat, longitude: loc2.lon };
};
