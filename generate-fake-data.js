// Generate fake purchase data for vending machines
import fs from 'fs';

// 50 Machine locations with realistic regions
const machines = [
  { uid: 'VM-001', name: 'Riga Central Station', region: 'Riga', city: 'Riga' },
  { uid: 'VM-002', name: 'Origo Shopping Mall', region: 'Riga', city: 'Riga' },
  { uid: 'VM-003', name: 'Riga Airport', region: 'Riga', city: 'Riga' },
  { uid: 'VM-004', name: 'Galerija Centrs', region: 'Riga', city: 'Riga' },
  { uid: 'VM-005', name: 'Riga Plaza', region: 'Riga', city: 'Riga' },
  { uid: 'VM-006', name: 'Alfa Shopping Centre', region: 'Riga', city: 'Riga' },
  { uid: 'VM-007', name: 'Old Town Tourist Center', region: 'Riga', city: 'Riga' },
  { uid: 'VM-008', name: 'Riga University Hospital', region: 'Riga', city: 'Riga' },
  { uid: 'VM-009', name: 'Daugavpils Central', region: 'Latgale', city: 'Daugavpils' },
  { uid: 'VM-010', name: 'Daugavpils Train Station', region: 'Latgale', city: 'Daugavpils' },
  { uid: 'VM-011', name: 'Liepaja Beach Mall', region: 'Kurzeme', city: 'Liepaja' },
  { uid: 'VM-012', name: 'Liepaja Port', region: 'Kurzeme', city: 'Liepaja' },
  { uid: 'VM-013', name: 'Jelgava Palace Area', region: 'Zemgale', city: 'Jelgava' },
  { uid: 'VM-014', name: 'Jelgava Bus Station', region: 'Zemgale', city: 'Jelgava' },
  { uid: 'VM-015', name: 'Jurmala Beach Resort', region: 'Riga Region', city: 'Jurmala' },
  { uid: 'VM-016', name: 'Jurmala Dzintari', region: 'Riga Region', city: 'Jurmala' },
  { uid: 'VM-017', name: 'Ventspils Harbor', region: 'Kurzeme', city: 'Ventspils' },
  { uid: 'VM-018', name: 'Rezekne Shopping Center', region: 'Latgale', city: 'Rezekne' },
  { uid: 'VM-019', name: 'Valmiera Town Center', region: 'Vidzeme', city: 'Valmiera' },
  { uid: 'VM-020', name: 'Cesis Castle Area', region: 'Vidzeme', city: 'Cesis' },
  { uid: 'VM-021', name: 'Sigulda Tourist Center', region: 'Vidzeme', city: 'Sigulda' },
  { uid: 'VM-022', name: 'Ogre Train Station', region: 'Riga Region', city: 'Ogre' },
  { uid: 'VM-023', name: 'Tukums Market Square', region: 'Zemgale', city: 'Tukums' },
  { uid: 'VM-024', name: 'Bauska Shopping Area', region: 'Zemgale', city: 'Bauska' },
  { uid: 'VM-025', name: 'Kuldiga Tourist Info', region: 'Kurzeme', city: 'Kuldiga' },
  { uid: 'VM-026', name: 'Talsi Town Hall', region: 'Kurzeme', city: 'Talsi' },
  { uid: 'VM-027', name: 'Ludza Border Crossing', region: 'Latgale', city: 'Ludza' },
  { uid: 'VM-028', name: 'Kraslava Medical Center', region: 'Latgale', city: 'Kraslava' },
  { uid: 'VM-029', name: 'Madona Central', region: 'Vidzeme', city: 'Madona' },
  { uid: 'VM-030', name: 'Gulbene Train Museum', region: 'Vidzeme', city: 'Gulbene' },
  { uid: 'VM-031', name: 'Aluksne Lake Area', region: 'Vidzeme', city: 'Aluksne' },
  { uid: 'VM-032', name: 'Limbazi Town Center', region: 'Vidzeme', city: 'Limbazi' },
  { uid: 'VM-033', name: 'Salaspils Medical', region: 'Riga Region', city: 'Salaspils' },
  { uid: 'VM-034', name: 'Olaine Industrial Park', region: 'Riga Region', city: 'Olaine' },
  { uid: 'VM-035', name: 'Saldus Shopping Mall', region: 'Kurzeme', city: 'Saldus' },
  { uid: 'VM-036', name: 'Dobele Market', region: 'Zemgale', city: 'Dobele' },
  { uid: 'VM-037', name: 'Aizkraukle Riverside', region: 'Vidzeme', city: 'Aizkraukle' },
  { uid: 'VM-038', name: 'Preili Town Square', region: 'Latgale', city: 'Preili' },
  { uid: 'VM-039', name: 'Livani Cultural Center', region: 'Latgale', city: 'Livani' },
  { uid: 'VM-040', name: 'Balvi Medical Clinic', region: 'Latgale', city: 'Balvi' },
  { uid: 'VM-041', name: 'Smiltene Castle', region: 'Vidzeme', city: 'Smiltene' },
  { uid: 'VM-042', name: 'Valka Border Station', region: 'Vidzeme', city: 'Valka' },
  { uid: 'VM-043', name: 'Auce Community Center', region: 'Zemgale', city: 'Auce' },
  { uid: 'VM-044', name: 'Jaunjelgava Port', region: 'Zemgale', city: 'Jaunjelgava' },
  { uid: 'VM-045', name: 'Pavilosta Beach', region: 'Kurzeme', city: 'Pavilosta' },
  { uid: 'VM-046', name: 'Aizpute Town Hall', region: 'Kurzeme', city: 'Aizpute' },
  { uid: 'VM-047', name: 'Vilani Shopping', region: 'Latgale', city: 'Vilani' },
  { uid: 'VM-048', name: 'Ape Medical Center', region: 'Vidzeme', city: 'Ape' },
  { uid: 'VM-049', name: 'Roja Port Area', region: 'Kurzeme', city: 'Roja' },
  { uid: 'VM-050', name: 'Kandava Old Town', region: 'Kurzeme', city: 'Kandava' },
];

// Medicine data with actual IDs and prices
const medicines = [
  { id: 'med-001', name: 'Mezym 10 000 V', price: 3.65 },
  { id: 'med-002', name: 'Loperamide Stirol 2 mg', price: 3.26 },
  { id: 'med-003', name: 'Magnerot 500 mg', price: 10.29 },
  { id: 'med-004', name: 'Elevit Pronatal', price: 14.54 },
  { id: 'med-005', name: 'Duphalac Fruit 667 mg/ml', price: 8.67 },
  { id: 'med-006', name: 'Faringodol 150 mg', price: 8.60 },
  { id: 'med-007', name: 'Microlax', price: 7.97 },
  { id: 'med-008', name: 'Gasec Gastrocaps 10 mg', price: 4.18 },
  { id: 'med-009', name: 'Lactulose-MIP 65 g/100 ml', price: 15.93 },
  { id: 'med-010', name: 'Eucarbon herbal', price: 8.48 },
  { id: 'med-011', name: 'Aciclovir Actavis 5% cream', price: 6.92 },
  { id: 'med-012', name: 'Braunol 75 mg/g', price: 22.28 },
  { id: 'med-013', name: 'Terbinafin-ratiopharm 1% cream', price: 9.49 },
  { id: 'med-014', name: 'Ketoconazol-ratiopharm 2% shampoo', price: 18.52 },
  { id: 'med-015', name: 'Acic 5% cream', price: 6.79 },
  { id: 'med-016', name: 'Iodine Valentis 5%', price: 1.30 },
  { id: 'med-017', name: 'Pretniezes gel 1%', price: 7.09 },
  { id: 'med-018', name: 'Fenivir 1% cream', price: 9.98 },
  { id: 'med-019', name: 'Onytec 8% nail lacquer', price: 29.95 },
  { id: 'med-020', name: 'Levomekols ointment', price: 7.35 },
  { id: 'med-021', name: 'Ibuprofen JNX 400 mg', price: 2.98 },
  { id: 'med-022', name: 'Nurofen Forte Express 400 mg', price: 8.71 },
  { id: 'med-023', name: 'Ibuprofen-Grindeks 400 mg', price: 2.04 },
  { id: 'med-024', name: 'Paracetamol SanoSwiss 500 mg', price: 3.95 },
  { id: 'med-025', name: 'Paracetamol Unifarma 500 mg', price: 2.98 },
  { id: 'med-026', name: 'Paracetamol Zentiva 500 mg', price: 3.65 },
  { id: 'med-027', name: 'Aspirin 500 mg', price: 4.70 },
  { id: 'med-028', name: 'Aspirin 500 mg (100 pack)', price: 13.72 },
  { id: 'med-029', name: 'Paracetamol Sopharma 500 mg', price: 3.66 },
  { id: 'med-030', name: 'Aspirin C 400mg/240mg effervescent', price: 6.19 },
  { id: 'med-031', name: 'ACC 200 mg effervescent tablets', price: 6.92 },
  { id: 'med-032', name: 'Loratin 10 mg', price: 12.34 },
  { id: 'med-033', name: 'Strepsils Intensive 8.75 mg', price: 12.45 },
  { id: 'med-034', name: 'Olynth HA 0.1% nasal spray', price: 7.38 },
  { id: 'med-035', name: 'Cetrix 10 mg', price: 5.17 },
  { id: 'med-036', name: 'Cetirizin Actavis 10 mg', price: 6.03 },
  { id: 'med-037', name: 'Ambroxol-BCPP 30 mg', price: 3.39 },
  { id: 'med-038', name: 'Loracip 10 mg', price: 2.74 },
  { id: 'med-039', name: 'Galazolin 0.1% nasal drops', price: 2.76 },
  { id: 'med-040', name: 'Stoptussin 4mg/100mg', price: 8.39 },
  { id: 'med-041', name: 'Nurofen for Children Orange 100ml', price: 12.07 },
  { id: 'med-042', name: 'Ibuprofen JNX 400 mg (100 pack)', price: 10.98 },
  { id: 'med-043', name: 'Nurofen for Children Strawberry 100ml', price: 12.07 },
  { id: 'med-044', name: 'Ibuprofenum US Pharmacia 400 mg', price: 3.35 },
  { id: 'med-045', name: 'Nurofen with orange flavor 100ml', price: 11.03 },
  { id: 'med-046', name: 'Nurofen for Children Orange 150ml', price: 15.16 },
  { id: 'med-047', name: 'Ibuprofen Inteli 100 mg/5 ml suspension', price: 7.71 },
  { id: 'med-048', name: 'Paracetamol-ratiopharm 250 mg suppositories', price: 6.43 },
  { id: 'med-049', name: 'Paracetamol-ratiopharm 125 mg suppositories', price: 5.39 },
  { id: 'med-050', name: 'Paracetamol Sopharma 500 mg (alt)', price: 3.84 },
];

// Helper functions
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePurchaseId() {
  return 'PUR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Generate 1000 purchase records
const purchases = [];
const startDate = new Date('2024-09-01');
const endDate = new Date('2025-01-17');

console.log('Generating 1000 fake purchase records...');

for (let i = 0; i < 1000; i++) {
  const machine = randomItem(machines);
  const medicine = randomItem(medicines);
  const purchaseDate = randomDate(startDate, endDate);
  const purchaseId = generatePurchaseId();

  // Some purchases might have multiple items (10% chance)
  const itemCount = Math.random() > 0.9 ? randomInt(2, 3) : 1;
  let totalPrice = 0;
  let items = [];

  if (itemCount === 1) {
    items.push(medicine.id);
    totalPrice = medicine.price;
  } else {
    // Multiple items
    for (let j = 0; j < itemCount; j++) {
      const med = randomItem(medicines);
      items.push(med.id);
      totalPrice += med.price;
    }
  }

  purchases.push({
    purchase_id: purchaseId,
    machine_uid: machine.uid,
    machine_name: machine.name,
    region: machine.region,
    city: machine.city,
    date: formatDate(purchaseDate),
    item_ids: items.join(';'), // Multiple items separated by semicolon
    item_count: itemCount,
    total_price: totalPrice.toFixed(2),
    payment_status: Math.random() > 0.02 ? 'completed' : 'refunded', // 2% refund rate
  });

  if ((i + 1) % 100 === 0) {
    console.log(`Generated ${i + 1}/1000 records...`);
  }
}

// Sort by date
purchases.sort((a, b) => new Date(a.date) - new Date(b.date));

// Create CSV
const headers = [
  'purchase_id',
  'machine_uid',
  'machine_name',
  'region',
  'city',
  'date',
  'item_ids',
  'item_count',
  'total_price',
  'payment_status'
];

let csv = headers.join(',') + '\n';

purchases.forEach(purchase => {
  const row = [
    purchase.purchase_id,
    purchase.machine_uid,
    `"${purchase.machine_name}"`, // Quoted to handle commas in names
    purchase.region,
    purchase.city,
    purchase.date,
    `"${purchase.item_ids}"`, // Quoted for semicolon-separated values
    purchase.item_count,
    purchase.total_price,
    purchase.payment_status
  ];
  csv += row.join(',') + '\n';
});

// Save to file
fs.writeFileSync('fake-purchases-data.csv', csv, 'utf8');

console.log('\n✅ Successfully generated 1000 purchase records!');
console.log('📄 File saved: fake-purchases-data.csv');
console.log('\n📊 Statistics:');
console.log(`- Total purchases: ${purchases.length}`);
console.log(`- Date range: ${formatDate(startDate)} to ${formatDate(endDate)}`);
console.log(`- Machines: ${machines.length}`);
console.log(`- Medicine types: ${medicines.length}`);
console.log(`- Total revenue: €${purchases.reduce((sum, p) => sum + parseFloat(p.total_price), 0).toFixed(2)}`);

const completed = purchases.filter(p => p.payment_status === 'completed').length;
const refunded = purchases.filter(p => p.payment_status === 'refunded').length;
console.log(`- Completed: ${completed} (${(completed/purchases.length*100).toFixed(1)}%)`);
console.log(`- Refunded: ${refunded} (${(refunded/purchases.length*100).toFixed(1)}%)`);
