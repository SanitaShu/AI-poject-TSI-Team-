// Script to parse the CSV data and generate TypeScript data files
import * as fs from 'fs';
import * as path from 'path';

const csvPath = path.join(process.cwd(), 'fake-purchases-data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Latvian city coordinates (approximate)
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Riga': { lat: 56.9496, lng: 24.1052 },
  'Daugavpils': { lat: 55.8744, lng: 26.5362 },
  'Liepaja': { lat: 56.5046, lng: 21.0109 },
  'Jelgava': { lat: 56.6500, lng: 23.7294 },
  'Jurmala': { lat: 56.9481, lng: 23.6196 },
  'Ventspils': { lat: 57.3947, lng: 21.5644 },
  'Rezekne': { lat: 56.5090, lng: 27.3330 },
  'Valmiera': { lat: 57.5378, lng: 25.4260 },
  'Cesis': { lat: 57.3119, lng: 25.2706 },
  'Sigulda': { lat: 57.1544, lng: 24.8537 },
  'Ogre': { lat: 56.8162, lng: 24.6042 },
  'Tukums': { lat: 56.9674, lng: 23.1556 },
  'Bauska': { lat: 56.4085, lng: 24.1922 },
  'Kuldiga': { lat: 56.9684, lng: 21.9662 },
  'Talsi': { lat: 57.2447, lng: 22.5881 },
  'Ludza': { lat: 56.5463, lng: 27.7174 },
  'Kraslava': { lat: 55.8945, lng: 27.1673 },
  'Madona': { lat: 56.8539, lng: 26.2172 },
  'Gulbene': { lat: 57.1770, lng: 26.7523 },
  'Aluksne': { lat: 57.4236, lng: 27.0467 },
  'Limbazi': { lat: 57.5130, lng: 24.7147 },
  'Salaspils': { lat: 56.8605, lng: 24.3500 },
  'Olaine': { lat: 56.7856, lng: 23.9383 },
  'Saldus': { lat: 56.6639, lng: 22.4908 },
  'Dobele': { lat: 56.6259, lng: 23.2830 },
  'Aizkraukle': { lat: 56.6044, lng: 25.2553 },
  'Preili': { lat: 56.2947, lng: 26.7253 },
  'Livani': { lat: 56.3544, lng: 26.1764 },
  'Balvi': { lat: 57.1310, lng: 27.2644 },
  'Smiltene': { lat: 57.4243, lng: 25.9021 },
  'Valka': { lat: 57.7772, lng: 26.0162 },
  'Auce': { lat: 56.4589, lng: 22.9017 },
  'Jaunjelgava': { lat: 56.6108, lng: 25.0861 },
  'Pavilosta': { lat: 56.8856, lng: 21.1869 },
  'Aizpute': { lat: 56.7219, lng: 21.6006 },
  'Vilani': { lat: 56.5526, lng: 26.9262 },
  'Ape': { lat: 57.5394, lng: 26.6944 },
  'Roja': { lat: 57.5053, lng: 22.8011 },
  'Kandava': { lat: 57.0336, lng: 22.7764 },
};

// Parse machines
const machinesMap = new Map<string, any>();
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const parts = line.split(',');
  if (parts.length >= 5) {
    const machineId = parts[1];
    const machineName = parts[2];
    const region = parts[3];
    const city = parts[4];

    if (!machinesMap.has(machineId)) {
      const coords = cityCoordinates[city] || { lat: 56.9496, lng: 24.1052 };
      machinesMap.set(machineId, {
        id: machineId,
        name: machineName,
        region,
        city,
        latitude: coords.lat + (Math.random() - 0.5) * 0.01, // Add small random offset
        longitude: coords.lng + (Math.random() - 0.5) * 0.01,
      });
    }
  }
}

const machines = Array.from(machinesMap.values()).sort((a, b) => {
  const aNum = parseInt(a.id.split('-')[1]);
  const bNum = parseInt(b.id.split('-')[1]);
  return aNum - bNum;
});

console.log('Parsed', machines.length, 'vending machines');
console.log(JSON.stringify(machines.slice(0, 5), null, 2));
