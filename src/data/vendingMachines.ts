import { InventoryItem } from '../stores/appStore';

export interface VendingMachineLocation {
  id: string;
  name: string;
  region: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'maintenance' | 'offline';
  lastMaintenance: Date;
  inventory: InventoryItem[];
}

// Latvian vending machine locations from actual CSV data
export const vendingMachineLocations: VendingMachineLocation[] = [
  { id: 'VM-001', name: 'Riga Central Station', region: 'Riga', city: 'Riga', address: 'Stacijas laukums 2', latitude: 56.9467, longitude: 24.1214, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-002', name: 'Origo Shopping Mall', region: 'Riga', city: 'Riga', address: 'Stacijas laukums 2', latitude: 56.9485, longitude: 24.1198, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-003', name: 'Riga Airport', region: 'Riga', city: 'Riga', address: 'Marupe, Riga LV-1053', latitude: 56.9237, longitude: 23.9711, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-004', name: 'Galerija Centrs', region: 'Riga', city: 'Riga', address: 'Audēju iela 16', latitude: 56.9496, longitude: 24.1134, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-005', name: 'Riga Plaza', region: 'Riga', city: 'Riga', address: 'Mūkusalas iela 71', latitude: 56.9330, longitude: 24.0799, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-006', name: 'Alfa Shopping Centre', region: 'Riga', city: 'Riga', address: 'Brīvības gatve 372', latitude: 56.9872, longitude: 24.1783, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-007', name: 'Old Town Tourist Center', region: 'Riga', city: 'Riga', address: 'Rātslaukums 6', latitude: 56.9488, longitude: 24.1052, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-008', name: 'Riga University Hospital', region: 'Riga', city: 'Riga', address: 'Pilsoņu iela 13', latitude: 56.9577, longitude: 24.1138, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-009', name: 'Daugavpils Central', region: 'Latgale', city: 'Daugavpils', address: 'Rīgas iela 22A', latitude: 55.8744, longitude: 26.5362, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-010', name: 'Daugavpils Train Station', region: 'Latgale', city: 'Daugavpils', address: 'Stacijas iela 45', latitude: 55.8812, longitude: 26.5195, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-011', name: 'Liepaja Beach Mall', region: 'Kurzeme', city: 'Liepaja', address: 'Jūrmalas iela 12', latitude: 56.5148, longitude: 21.0221, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-012', name: 'Liepaja Port', region: 'Kurzeme', city: 'Liepaja', address: 'Vecā ostmala 33', latitude: 56.5046, longitude: 21.0109, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-013', name: 'Jelgava Palace Area', region: 'Zemgale', city: 'Jelgava', address: 'Lielā iela 2', latitude: 56.6509, longitude: 23.7310, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-014', name: 'Jelgava Bus Station', region: 'Zemgale', city: 'Jelgava', address: 'Pasta iela 47', latitude: 56.6467, longitude: 23.7226, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-015', name: 'Jurmala Beach Resort', region: 'Riga Region', city: 'Jurmala', address: 'Jomas iela 47/49', latitude: 56.9481, longitude: 23.6196, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-016', name: 'Jurmala Dzintari', region: 'Riga Region', city: 'Jurmala', address: 'Turaidas iela 1', latitude: 56.9735, longitude: 23.7703, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-017', name: 'Ventspils Harbor', region: 'Kurzeme', city: 'Ventspils', address: 'Ostasprojects 13', latitude: 57.3947, longitude: 21.5644, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-018', name: 'Rezekne Shopping Center', region: 'Latgale', city: 'Rezekne', address: 'Atbrīvošanas aleja 93', latitude: 56.5090, longitude: 27.3330, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-019', name: 'Valmiera Town Center', region: 'Vidzeme', city: 'Valmiera', address: 'Rīgas iela 18', latitude: 57.5378, longitude: 25.4260, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-020', name: 'Cesis Castle Area', region: 'Vidzeme', city: 'Cesis', address: 'Pils laukums 9', latitude: 57.3119, longitude: 25.2706, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-021', name: 'Sigulda Tourist Center', region: 'Vidzeme', city: 'Sigulda', address: 'Ausekļa iela 6', latitude: 57.1544, longitude: 24.8537, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-022', name: 'Ogre Train Station', region: 'Riga Region', city: 'Ogre', address: 'Stacijas iela 1', latitude: 56.8162, longitude: 24.6042, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-023', name: 'Tukums Market Square', region: 'Zemgale', city: 'Tukums', address: 'Talsu iela 2', latitude: 56.9674, longitude: 23.1556, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-024', name: 'Bauska Shopping Area', region: 'Zemgale', city: 'Bauska', address: 'Uzvaras iela 1', latitude: 56.4085, longitude: 24.1922, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-025', name: 'Kuldiga Tourist Info', region: 'Kurzeme', city: 'Kuldiga', address: 'Baznīcas iela 5', latitude: 56.9684, longitude: 21.9662, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-026', name: 'Talsi Town Hall', region: 'Kurzeme', city: 'Talsi', address: 'Kareivju iela 7', latitude: 57.2447, longitude: 22.5881, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-027', name: 'Ludza Border Crossing', region: 'Latgale', city: 'Ludza', address: 'Lielā iela 16', latitude: 56.5463, longitude: 27.7174, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-028', name: 'Kraslava Medical Center', region: 'Latgale', city: 'Kraslava', address: 'Rīgas iela 4', latitude: 55.8945, longitude: 27.1673, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-029', name: 'Madona Central', region: 'Vidzeme', city: 'Madona', address: 'Saieta laukums 1', latitude: 56.8539, longitude: 26.2172, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-030', name: 'Gulbene Train Museum', region: 'Vidzeme', city: 'Gulbene', address: 'Stacijas iela 1', latitude: 57.1770, longitude: 26.7523, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-031', name: 'Aluksne Lake Area', region: 'Vidzeme', city: 'Aluksne', address: 'Dārza iela 3', latitude: 57.4236, longitude: 27.0467, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-032', name: 'Limbazi Town Center', region: 'Vidzeme', city: 'Limbazi', address: 'Burtnieku iela 4', latitude: 57.5130, longitude: 24.7147, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-033', name: 'Salaspils Medical', region: 'Riga Region', city: 'Salaspils', address: 'Lazdu iela 4', latitude: 56.8605, longitude: 24.3500, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-034', name: 'Olaine Industrial Park', region: 'Riga Region', city: 'Olaine', address: 'Rūpniecības iela 2', latitude: 56.7856, longitude: 23.9383, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-035', name: 'Saldus Shopping Mall', region: 'Kurzeme', city: 'Saldus', address: 'Striķu iela 2a', latitude: 56.6639, longitude: 22.4908, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-036', name: 'Dobele Market', region: 'Zemgale', city: 'Dobele', address: 'Tirgus laukums 1', latitude: 56.6259, longitude: 23.2830, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-037', name: 'Aizkraukle Riverside', region: 'Vidzeme', city: 'Aizkraukle', address: 'Gaismas iela 35', latitude: 56.6044, longitude: 25.2553, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-038', name: 'Preili Town Square', region: 'Latgale', city: 'Preili', address: 'Rīgas iela 38', latitude: 56.2947, longitude: 26.7253, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-039', name: 'Livani Cultural Center', region: 'Latgale', city: 'Livani', address: 'Rīgas iela 77', latitude: 56.3544, longitude: 26.1764, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-040', name: 'Balvi Medical Clinic', region: 'Latgale', city: 'Balvi', address: 'Bērzpils iela 1a', latitude: 57.1310, longitude: 27.2644, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-041', name: 'Smiltene Castle', region: 'Vidzeme', city: 'Smiltene', address: 'Pils iela 3', latitude: 57.4243, longitude: 25.9021, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-042', name: 'Valka Border Station', region: 'Vidzeme', city: 'Valka', address: 'Rīgas iela 24', latitude: 57.7772, longitude: 26.0162, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-043', name: 'Auce Community Center', region: 'Zemgale', city: 'Auce', address: 'Jelgavas iela 25', latitude: 56.4589, longitude: 22.9017, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-044', name: 'Jaunjelgava Port', region: 'Zemgale', city: 'Jaunjelgava', address: 'Pasta iela 2', latitude: 56.6108, longitude: 25.0861, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-045', name: 'Pavilosta Beach', region: 'Kurzeme', city: 'Pavilosta', address: 'Dzintaru iela 32', latitude: 56.8856, longitude: 21.1869, status: 'maintenance', lastMaintenance: new Date('2025-11-15'), inventory: [] },
  { id: 'VM-046', name: 'Aizpute Town Hall', region: 'Kurzeme', city: 'Aizpute', address: 'Skolas iela 2', latitude: 56.7219, longitude: 21.6006, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-047', name: 'Vilani Shopping', region: 'Latgale', city: 'Vilani', address: 'Rēzeknes iela 1A', latitude: 56.5526, longitude: 26.9262, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-048', name: 'Ape Medical Center', region: 'Vidzeme', city: 'Ape', address: 'Stacijas iela 2', latitude: 57.5394, longitude: 26.6944, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-049', name: 'Roja Port Area', region: 'Kurzeme', city: 'Roja', address: 'Selgas iela 2', latitude: 57.5053, longitude: 22.8011, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-050', name: 'Kandava Old Town', region: 'Kurzeme', city: 'Kandava', address: 'Rātslaukums 1', latitude: 57.0336, longitude: 22.7764, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
];

export interface Recipe {
  id: string;
  patientName: string;
  doctorName: string;
  date: Date;
  medications: {
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  status: 'pending' | 'fulfilled' | 'cancelled';
  vendingMachineId?: string;
  fulfillmentDate?: Date;
}

export const recipes: Recipe[] = [
  {
    id: 'RX-001',
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: new Date('2025-11-22'),
    medications: [
      {
        medicineId: 'MED-001',
        medicineName: 'Ibuprofen',
        dosage: '400mg',
        frequency: '3 times daily',
        duration: '7 days',
      },
    ],
    status: 'fulfilled',
    vendingMachineId: 'VM-001',
    fulfillmentDate: new Date('2025-11-22'),
  },
  {
    id: 'RX-002',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Johnson',
    date: new Date('2025-11-21'),
    medications: [
      {
        medicineId: 'MED-015',
        medicineName: 'Cetirizine',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '14 days',
      },
    ],
    status: 'pending',
  },
  {
    id: 'RX-003',
    patientName: 'Mike Wilson',
    doctorName: 'Dr. Brown',
    date: new Date('2025-11-20'),
    medications: [
      {
        medicineId: 'MED-008',
        medicineName: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        duration: '5 days',
      },
    ],
    status: 'fulfilled',
    vendingMachineId: 'VM-003',
    fulfillmentDate: new Date('2025-11-21'),
  },
];
