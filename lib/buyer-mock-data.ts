export const BUYER_ORDERS = [
  {
    id: 'ORD-7721',
    date: '2024-03-01',
    total: 1299.99,
    status: 'Delivered',
    vendor: 'SteelWorks Machinery',
    items: [
      { id: 'p1', name: 'Industrial Grade Arc Welder 400A', quantity: 1, price: 1299.99 }
    ],
    tracking: [
      { date: '2024-03-01 14:20', status: 'Delivered', description: 'Package was left near the front door.', location: 'Houston, TX' },
      { date: '2024-03-01 08:45', status: 'Out for Delivery', description: 'Package is out for delivery.', location: 'Houston, TX' },
      { date: '2024-02-28 22:10', status: 'Arrived at Facility', description: 'Arrived at local distribution center.', location: 'Houston, TX' },
      { date: '2024-02-27 10:30', status: 'Shipped', description: 'Package has been shipped.', location: 'Chicago, IL' },
      { date: '2024-02-26 15:00', status: 'Processing', description: 'Order is being prepared.', location: 'Chicago, IL' },
    ]
  },
  {
    id: 'ORD-8842',
    date: '2024-03-02',
    total: 349.99,
    status: 'In Transit',
    vendor: 'Industrial Pro Solutions',
    items: [
      { id: 'p3', name: 'Professional Impact Wrench Kit', quantity: 1, price: 349.99 }
    ],
    tracking: [
      { date: '2024-03-03 09:00', status: 'In Transit', description: 'Package is in transit to the next facility.', location: 'Dallas, TX' },
      { date: '2024-03-02 16:30', status: 'Shipped', description: 'Package has been shipped.', location: 'Austin, TX' },
      { date: '2024-03-02 11:00', status: 'Processing', description: 'Order is being prepared.', location: 'Austin, TX' },
    ]
  }
];

export const BUYER_ADDRESSES = [
  {
    id: 'addr-1',
    type: 'Work',
    name: 'John Doe',
    company: 'Industrial Corp',
    street: '123 Industrial Way',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'Home',
    name: 'John Doe',
    company: '',
    street: '456 Residential Ave',
    city: 'Houston',
    state: 'TX',
    zip: '77002',
    isDefault: false
  }
];

export const BUYER_DISPUTES = [
  {
    id: 'DISP-101',
    orderId: 'ORD-6610',
    date: '2024-02-15',
    reason: 'Damaged on Arrival',
    status: 'Resolved',
    product: 'Hydraulic Excavator Bucket 24"',
    vendor: 'SteelWorks Machinery'
  },
  {
    id: 'DISP-102',
    orderId: 'ORD-7721',
    date: '2024-03-02',
    reason: 'Missing Parts',
    status: 'Under Review',
    product: 'Industrial Grade Arc Welder 400A',
    vendor: 'SteelWorks Machinery'
  }
];

export const SAVED_VENDORS = [
  {
    id: 'v1',
    name: 'Industrial Pro Solutions',
    rating: 4.8,
    logo: 'https://picsum.photos/seed/v1/100/100',
    category: 'Power Tools'
  },
  {
    id: 'v2',
    name: 'SteelWorks Machinery',
    rating: 4.5,
    logo: 'https://picsum.photos/seed/v2/100/100',
    category: 'Heavy Machinery'
  }
];
