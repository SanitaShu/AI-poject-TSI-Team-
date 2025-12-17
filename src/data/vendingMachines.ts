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

// Latvian vending machine locations - Updated with Mostafa's repositioned addresses
export const vendingMachineLocations: VendingMachineLocation[] = [
  { id: 'VM-001', name: 'W9CH+W5 Lats', region: 'Ropaži Municipality', city: 'Upeslejas', address: 'W9CH+W5 Lats, Upeslejas, Stopiņu pagasts, Ropažu novads, LV-2118', latitude: 56.9720, longitude: 24.3785, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-002', name: 'Vītoli AMI', region: 'Tukums Municipality', city: 'Tukums', address: 'Zemītes iela 2A, Tukums, Tukuma pilsēta, Tukuma novads, LV-3104', latitude: 56.9674, longitude: 23.1556, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-003', name: 'Valga Rimi Super', region: 'Valka Municipality', city: 'Valga', address: 'Riia tn 18, Valga, 68203 Valga maakond, Estonia', latitude: 57.7772, longitude: 26.0162, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-004', name: 'top!', region: 'Valmiera Municipality', city: 'Valmiermuiža', address: 'Valmiermuižas iela 11, Valmiermuiža, Valmieras pagasts, Valmieras novads, LV-4219', latitude: 57.5378, longitude: 25.4260, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-005', name: 'top!', region: 'Varakļāni Municipality', city: 'Varakļāni', address: 'Pils iela 7D, Varakļāni, Varakļāni pilsēta, Varakļānu novads, LV-4838', latitude: 56.6055, longitude: 26.5970, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-006', name: 'top!', region: 'Ogre Municipality', city: 'Ogre', address: 'Mednieku iela 21/23, Ogre, Ogres pilsēta, Ogres novads, LV-5001', latitude: 56.8162, longitude: 24.6042, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-007', name: 'top!', region: 'Bauska Municipality', city: 'Iecava', address: 'Edvarta Virzas iela 2, Iecava, Iecava pilsēta, Bauskas novads, LV-3913', latitude: 56.5987, longitude: 24.2030, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-008', name: 'TC Apelsins', region: 'Ādaži Municipality', city: 'Ādaži', address: 'Rīgas gatve 5, Ādaži, Ādaži pilsēta, Ādažu novads, LV-2164', latitude: 57.0743, longitude: 24.3247, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-009', name: 'Siguldas Ezītis miglā', region: 'Sigulda Municipality', city: 'Sigulda', address: 'Rūdolfa Blaumaņa iela 2, Sigulda, Siguldas pilsēta, Siguldas novads, LV-2150', latitude: 57.1544, longitude: 24.8537, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-010', name: 'Rimi', region: 'Jelgava Municipality', city: 'Jelgava', address: 'Katoļu iela 18, Jelgava, LV-3001', latitude: 56.6509, longitude: 23.7310, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-011', name: 'Rimi Super Valmiera', region: 'Valmiera Municipality', city: 'Valmiera', address: 'Fabrikas iela 2, Valmiera, LV-4201', latitude: 57.5385, longitude: 25.4271, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-012', name: 'Rimi Super Ķekava', region: 'Ķekava Municipality', city: 'Ķekava', address: 'Rīgas iela 22, Ķekava, Ķekava pilsēta, Ķekavas novads, LV-2123', latitude: 56.8279, longitude: 24.2175, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-013', name: 'Rimi Super Carnikava', region: 'Ādaži Municipality', city: 'Carnikava', address: 'Atpūtas iela 1, Carnikava, Carnikavas pagasts, Ādažu novads, LV-2163', latitude: 57.1275, longitude: 24.2071, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-014', name: 'Rimi shop', region: 'Olaine Municipality', city: 'Olaine', address: 'Stacijas iela 8, Olaine, Olaines pilsēta, Olaines novads, LV-2114', latitude: 56.7856, longitude: 23.9383, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-015', name: 'Rimi Hyper Salaspils', region: 'Salaspils Municipality', city: 'Salaspils', address: 'Skolas iela 4e, Salaspils, Salaspils pilsēta, Salaspils novads, LV-2121', latitude: 56.8605, longitude: 24.3500, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-016', name: 'Rimi Hyper Rēzekne', region: 'Rēzekne Municipality', city: 'Rēzekne', address: 'Atbrīvošanas Aleja 138, Rēzekne, LV-4601', latitude: 56.5090, longitude: 27.3330, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-017', name: 'Rimi Hyper Ogre', region: 'Ogre Municipality', city: 'Ogre', address: 'Rīgas iela 33, Ogre, Ogres pilsēta, Ogres novads, LV-5001', latitude: 56.8145, longitude: 24.6070, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-018', name: 'Rimi Hyper Dobele', region: 'Dobele Municipality', city: 'Dobele', address: 'Brīvības iela 30, Dobele, Dobeles pilsēta, Dobeles novads, LV-3701', latitude: 56.6259, longitude: 23.2830, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-019', name: 'Rimi Hyper Bauska', region: 'Bauska Municipality', city: 'Bauska', address: 'Pionieru iela 2, Bauska, Bauskas pilsēta, Bauskas novads, LV-3901', latitude: 56.4085, longitude: 24.1922, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-020', name: 'Primeclass Business Lounge', region: 'Mārupe Municipality', city: 'Skulte', address: 'Skulte, Mārupes pagasts, Mārupes novads, LV-1053', latitude: 56.9237, longitude: 23.9711, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-021', name: 'Mego', region: 'Ogre Municipality', city: 'Ogre', address: 'Skolas iela 4, Ogre, Ogres pilsēta, Ogres novads, LV-5001', latitude: 56.8153, longitude: 24.6048, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-022', name: 'Mego', region: 'Ludza Municipality', city: 'Ludza', address: 'Raiņa iela 40A, Ludza, Ludzas pilsēta, Ludzas novads, LV-5701', latitude: 56.5463, longitude: 27.7174, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-023', name: 'Maxima XX', region: 'Madona Municipality', city: 'Madona', address: 'Rūpniecības iela 49, Madona, Madonas pilsēta, Madonas novads, LV-4801', latitude: 56.8539, longitude: 26.2172, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-024', name: 'Maxima XX', region: 'Talsi Municipality', city: 'Talsi', address: 'Rīgas iela 8, Talsi, Talsu pilsēta, Talsu novads, LV-3201', latitude: 57.2447, longitude: 22.5881, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-025', name: 'Maxima XX', region: 'Tukums Municipality', city: 'Tukums', address: 'Kurzemes iela 36, Tukums, Tukuma pilsēta, Tukuma novads, LV-3101', latitude: 56.9670, longitude: 23.1545, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-026', name: 'Maxima XX', region: 'Līvāni Municipality', city: 'Līvāni', address: 'Domes iela 4A, Līvāni, Līvānu pilsēta, Līvānu novads, LV-5316', latitude: 56.3544, longitude: 26.1764, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-027', name: 'Maxima XX', region: 'Augšdaugava Municipality', city: 'Daugavpils', address: 'Cietokšņa iela 60, Daugavpils, LV-5401', latitude: 55.8744, longitude: 26.5362, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-028', name: 'Maxima XX', region: 'Saldus Municipality', city: 'Saldus', address: 'Brīvības iela 30, Saldus, Saldus pilsēta, Saldus novads, LV-3801', latitude: 56.6639, longitude: 22.4908, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-029', name: 'Maxima XX', region: 'Jēkabpils Municipality', city: 'Jēkabpils', address: 'Brīvības iela 108, Jēkabpils, LV-5201', latitude: 56.4999, longitude: 25.8736, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-030', name: 'Maxima XX', region: 'Limbaži Municipality', city: 'Limbaži', address: 'Stacijas iela 8, Limbaži, Limbažu pilsēta, Limbažu novads, LV-4001', latitude: 57.5130, longitude: 24.7147, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-031', name: 'Maxima X', region: 'Preiļi Municipality', city: 'Preiļi', address: 'Rēzeknes iela 4A, Preiļi, Preiļu pilsēta, Preiļu novads, LV-5301', latitude: 56.2947, longitude: 26.7253, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-032', name: 'Maxima X', region: 'Ķekava Municipality', city: 'Rīga', address: 'Prūšu iela 21, Latgales priekšpilsēta, Rīga, LV-1057', latitude: 56.9253, longitude: 24.1690, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-033', name: 'Maxima X', region: 'Alūksne Municipality', city: 'Alūksne', address: 'Pils iela 9B, Alūksne, Alūksne pilsēta, Alūksnes novads, LV-4301', latitude: 57.4236, longitude: 27.0467, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-034', name: 'Maxima X', region: 'Dienvidkurzeme Municipality', city: 'Aizpute', address: 'Kalvenes iela 11, Aizpute, Aizputes pilsēta, Dienvidkurzemes novads, LV-3456', latitude: 56.7219, longitude: 21.6006, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-035', name: 'Maxima X', region: 'Aizkraukle Municipality', city: 'Aizkraukle', address: 'Gaismas iela 22, Aizkraukle, Aizkraukle pilsēta, Aizkraukles novads, LV-5101', latitude: 56.6044, longitude: 25.2553, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-036', name: 'Maxima X', region: 'Krāslava Municipality', city: 'Dagda', address: 'Daugavpils iela 8a, Dagda, Dagdas pilsēta, Krāslavas novads, LV-5674', latitude: 56.0947, longitude: 27.5357, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-037', name: 'Maxima X', region: 'Smiltene Municipality', city: 'Smiltene', address: 'Atmodas iela 4, Smiltene, Smiltenes pilsēta, Smiltenes novads, LV-4729', latitude: 57.4243, longitude: 25.9021, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-038', name: 'Lidl', region: 'Ventspils Municipality', city: 'Ventspils', address: 'Kuldīgas iela 90, Ventspils, LV-3601', latitude: 57.3947, longitude: 21.5644, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-039', name: 'LaTS', region: 'Jēkabpils Municipality', city: 'Jēkabpils', address: 'Rīgas iela 218h, Jēkabpils, LV-5202', latitude: 56.5015, longitude: 25.8750, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-040', name: 'Hesburger', region: 'Kuldīga Municipality', city: 'Kuldīga', address: 'Sūru iela 3, Kuldīga, Kuldīgas pilsēta, Kuldīgas novads, LV-3301', latitude: 56.9684, longitude: 21.9662, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-041', name: 'Hercogs Restaurant', region: 'Mārupe Municipality', city: 'Mārupe', address: 'Vītiņu iela 4, Mārupe, Mārupe pilsēta, Mārupes novads, LV-2167', latitude: 56.9053, longitude: 24.0242, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-042', name: 'Elvi', region: 'Ropaži Municipality', city: 'Ulbroka', address: 'Peldu iela 2, Ulbroka, Stopiņu pagasts, Ropažu novads, LV-2130', latitude: 56.9404, longitude: 24.2699, status: 'active', lastMaintenance: new Date('2025-11-17'), inventory: [] },
  { id: 'VM-043', name: 'Elvi', region: 'Sigulda Municipality', city: 'Sigulda', address: 'Dārza iela 28, Sigulda, Siguldas pilsēta, Siguldas novads, LV-2150', latitude: 57.1530, longitude: 24.8525, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-044', name: 'Cēsis Market', region: 'Cēsis Municipality', city: 'Cēsis', address: 'Uzvaras bulvāris 24, Cēsis, Cēsu pilsēta, Cēsu novads, LV-4101', latitude: 57.3119, longitude: 25.2706, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
  { id: 'VM-045', name: 'Beta', region: 'Gulbene Municipality', city: 'Gulbene', address: 'Brīvības iela 56, Gulbene, Gulbenes pilsēta, Gulbenes novads, LV-4401', latitude: 57.1770, longitude: 26.7523, status: 'active', lastMaintenance: new Date('2025-11-15'), inventory: [] },
  { id: 'VM-046', name: 'Balvu autoosta', region: 'Balvi Municipality', city: 'Balvi', address: 'Brīvības iela 57, Balvi, Balvu pilsēta, Balvu novads, LV-4501', latitude: 57.1310, longitude: 27.2644, status: 'active', lastMaintenance: new Date('2025-11-21'), inventory: [] },
  { id: 'VM-047', name: 'Abrands.lv', region: 'Cēsis Municipality', city: 'Cēsis', address: 'Bērzaines iela 2A, Cēsis, Cēsu pilsēta, Cēsu novads, LV-4101', latitude: 57.3105, longitude: 25.2698, status: 'active', lastMaintenance: new Date('2025-11-18'), inventory: [] },
  { id: 'VM-048', name: 'VITA MĀRKETS Elvi', region: 'Saulkrasti Municipality', city: 'Saulkrasti', address: 'Ainažu iela 28A, Saulkrasti, Saulkrastu pilsēta, Saulkrastu novads, LV-2160', latitude: 57.2660, longitude: 24.4065, status: 'active', lastMaintenance: new Date('2025-11-22'), inventory: [] },
  { id: 'VM-049', name: 'Lenoka Mego', region: 'Ropaži Municipality', city: 'Saurieši', address: 'Kazāru iela 4, Saurieši, Stopiņu pagasts, Ropažu novads, LV-2118', latitude: 56.9550, longitude: 24.3200, status: 'active', lastMaintenance: new Date('2025-11-19'), inventory: [] },
  { id: 'VM-050', name: 'Banderi S.IDE', region: 'Mārupe Municipality', city: 'Mārupe', address: 'Mārupe, Mārupes novads', latitude: 56.9053, longitude: 24.0242, status: 'active', lastMaintenance: new Date('2025-11-20'), inventory: [] },
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
