export const CATEGORIES = [
  { id: '1', name: 'Power Tools', slug: 'power-tools', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800' },
  { id: '2', name: 'Heavy Machinery', slug: 'heavy-machinery', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800' },
  { id: '3', name: 'Safety Equipment', slug: 'safety', image: 'https://images.unsplash.com/photo-1588698188151-512c9c71a396?auto=format&fit=crop&q=80&w=800' },
  { id: '4', name: 'Welding & Cutting', slug: 'welding', image: 'https://images.unsplash.com/photo-1504917595217-d414ba2023c0?auto=format&fit=crop&q=80&w=800' },
  { id: '5', name: 'Hand Tools', slug: 'hand-tools', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800' },
  { id: '6', name: 'Pneumatics', slug: 'pneumatics', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800' },
];

export const VENDORS = [
  { id: 'v1', name: 'Industrial Pro Solutions', rating: 4.8, reviews: 1250, logo: 'https://picsum.photos/seed/v1/100/100', description: 'Leading supplier of heavy-duty industrial equipment since 1995.' },
  { id: 'v2', name: 'SteelWorks Machinery', rating: 4.5, reviews: 840, logo: 'https://picsum.photos/seed/v2/100/100', description: 'Specializing in metalworking and fabrication tools.' },
  { id: 'v3', name: 'SafetyFirst Gear', rating: 4.9, reviews: 2100, logo: 'https://picsum.photos/seed/v3/100/100', description: 'Your trusted partner for workplace safety and PPE.' },
];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Heavy Duty 3D Granite Marble Stone CNC',
    description: 'Industrial grade 3D CNC router designed specifically for granite, marble, and heavy stone carving. Features a water-cooled spindle and high precision stepper motors.',
    price: 18500.00,
    category: 'Heavy Machinery',
    categoryId: '2',
    vendorId: 'v2',
    vendorName: 'SteelWorks Machinery',
    rating: 4.9,
    reviews: 64,
    images: [
      'https://images.unsplash.com/photo-1504917595217-d414ba2023c0?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      'Spindle Power': '5.5kW Water Cooled',
      'Working Area': '1300x2500x300mm',
      'Precision': '0.05mm',
      'Weight': '1200kg',
    },
    stock: 3,
  },
  {
    id: 'p2',
    name: 'Industrial Metal Fiber Laser Cutter',
    description: 'High-speed fiber laser cutting machine designed for carbon steel, stainless steel, and aluminum sheets. Ensures zero-dross clean cuts.',
    price: 32000.00,
    category: 'Welding & Cutting',
    categoryId: '4',
    vendorId: 'v1',
    vendorName: 'Industrial Pro Solutions',
    rating: 4.8,
    reviews: 42,
    images: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      'Laser Power': '2000W - 6000W',
      'Cutting Area': '1500x3000mm',
      'Max Speed': '120m/min',
    },
    stock: 2,
  },
  {
    id: 'p3',
    name: '5-Axis CNC Milling Center',
    description: 'Fully enclosed 5-axis CNC machining center for aerospace and automotive parts. Offers ultra-high precision and automated tool changing.',
    price: 85000.00,
    category: 'Power Tools',
    categoryId: '1',
    vendorId: 'v2',
    vendorName: 'SteelWorks Machinery',
    rating: 5.0,
    reviews: 18,
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      'Tool Capacity': '24 Tools',
      'Spindle Speed': '12000 RPM',
      'Control System': 'Siemens 840D',
    },
    stock: 1,
  },
  {
    id: 'p4',
    name: 'Automated Robotic Welding Arm',
    description: '6-axis robotic welding arm for assembly lines. Compatible with MIG, TIG, and laser welding attachments.',
    price: 15400.50,
    category: 'Welding & Cutting',
    categoryId: '4',
    vendorId: 'v3',
    vendorName: 'SafetyFirst Gear',
    rating: 4.7,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      'Payload': '20kg',
      'Reach': '1800mm',
      'Repeatability': '±0.04mm',
    },
    stock: 8,
  },
];
