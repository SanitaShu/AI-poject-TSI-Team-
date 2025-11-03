export interface Medicine {
  id: string;
  name: string;
  price: number;
  group: number;
  description: string;
}

export interface MedicineGroup {
  id: number;
  name: string;
  description: string;
}

export const medicineGroups: MedicineGroup[] = [
  {
    id: 1,
    name: 'Pain Relief',
    description: 'Medications for headaches, muscle pain, and general discomfort',
  },
  {
    id: 2,
    name: 'Cold & Flu',
    description: 'Relief from cold symptoms, congestion, and flu',
  },
  {
    id: 3,
    name: 'Digestive Health',
    description: 'Treatments for stomach issues and digestive problems',
  },
  {
    id: 4,
    name: 'First Aid',
    description: 'Essential items for minor injuries and wounds',
  },
  {
    id: 5,
    name: 'Vitamins & Supplements',
    description: 'Daily vitamins and nutritional supplements',
  },
];

export const medicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Ibuprofen 200mg',
    price: 8.99,
    group: 1,
    description: 'Fast-acting pain relief for headaches and muscle pain',
  },
  {
    id: 'med-2',
    name: 'Acetaminophen 500mg',
    price: 7.49,
    group: 1,
    description: 'Gentle pain relief and fever reducer',
  },
  {
    id: 'med-3',
    name: 'Aspirin 325mg',
    price: 6.99,
    group: 1,
    description: 'Pain relief and anti-inflammatory',
  },
  {
    id: 'med-4',
    name: 'Naproxen 220mg',
    price: 9.99,
    group: 1,
    description: 'Long-lasting pain relief',
  },
  {
    id: 'med-5',
    name: 'Muscle Pain Relief Gel',
    price: 11.99,
    group: 1,
    description: 'Topical pain relief for sore muscles',
  },
  {
    id: 'med-6',
    name: 'Cold & Flu Relief',
    price: 12.99,
    group: 2,
    description: 'Multi-symptom cold and flu relief',
  },
  {
    id: 'med-7',
    name: 'Decongestant Spray',
    price: 9.49,
    group: 2,
    description: 'Fast nasal congestion relief',
  },
  {
    id: 'med-8',
    name: 'Cough Syrup',
    price: 10.99,
    group: 2,
    description: 'Soothes cough and throat irritation',
  },
  {
    id: 'med-9',
    name: 'Throat Lozenges',
    price: 5.99,
    group: 2,
    description: 'Soothing relief for sore throat',
  },
  {
    id: 'med-10',
    name: 'Allergy Relief',
    price: 13.99,
    group: 2,
    description: 'Non-drowsy allergy relief',
  },
  {
    id: 'med-11',
    name: 'Antacid Tablets',
    price: 7.99,
    group: 3,
    description: 'Fast heartburn and indigestion relief',
  },
  {
    id: 'med-12',
    name: 'Anti-Diarrheal',
    price: 8.49,
    group: 3,
    description: 'Controls diarrhea symptoms',
  },
  {
    id: 'med-13',
    name: 'Laxative',
    price: 9.99,
    group: 3,
    description: 'Gentle relief from constipation',
  },
  {
    id: 'med-14',
    name: 'Probiotic Supplement',
    price: 15.99,
    group: 3,
    description: 'Supports digestive health',
  },
  {
    id: 'med-15',
    name: 'Gas Relief',
    price: 6.99,
    group: 3,
    description: 'Relieves bloating and gas',
  },
  {
    id: 'med-16',
    name: 'Adhesive Bandages',
    price: 4.99,
    group: 4,
    description: 'Assorted sizes for minor cuts',
  },
  {
    id: 'med-17',
    name: 'Antiseptic Wipes',
    price: 5.49,
    group: 4,
    description: 'Cleans and disinfects wounds',
  },
  {
    id: 'med-18',
    name: 'Antibiotic Ointment',
    price: 7.99,
    group: 4,
    description: 'Prevents infection in minor wounds',
  },
  {
    id: 'med-19',
    name: 'Gauze Pads',
    price: 6.49,
    group: 4,
    description: 'Sterile wound dressing',
  },
  {
    id: 'med-20',
    name: 'Medical Tape',
    price: 3.99,
    group: 4,
    description: 'Secures bandages and dressings',
  },
  {
    id: 'med-21',
    name: 'Vitamin C 1000mg',
    price: 12.99,
    group: 5,
    description: 'Immune system support',
  },
  {
    id: 'med-22',
    name: 'Multivitamin',
    price: 14.99,
    group: 5,
    description: 'Complete daily nutrition',
  },
  {
    id: 'med-23',
    name: 'Vitamin D3',
    price: 11.99,
    group: 5,
    description: 'Bone health and immune support',
  },
  {
    id: 'med-24',
    name: 'Omega-3 Fish Oil',
    price: 16.99,
    group: 5,
    description: 'Heart and brain health',
  },
  {
    id: 'med-25',
    name: 'Calcium + Vitamin D',
    price: 13.49,
    group: 5,
    description: 'Bone strength support',
  },
];
