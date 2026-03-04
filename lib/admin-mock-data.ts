export const ADMIN_STATS = {
  gmv: 2450000,
  totalVendors: 1240,
  conversionRate: 3.2,
  activeUsers: 45200,
  gmvData: [
    { name: 'Jan', gmv: 320000 },
    { name: 'Feb', gmv: 380000 },
    { name: 'Mar', gmv: 450000 },
    { name: 'Apr', gmv: 410000 },
    { name: 'May', gmv: 520000 },
    { name: 'Jun', gmv: 650000 },
  ],
  vendorGrowth: [
    { name: 'Jan', vendors: 800 },
    { name: 'Feb', vendors: 900 },
    { name: 'Mar', vendors: 1050 },
    { name: 'Apr', vendors: 1100 },
    { name: 'May', vendors: 1180 },
    { name: 'Jun', vendors: 1240 },
  ]
};

export const PENDING_VENDORS = [
  { id: 'v-101', name: 'Global Tools Inc', type: 'Manufacturer', country: 'Germany', appliedDate: '2024-03-01', status: 'Pending' },
  { id: 'v-102', name: 'Precision Parts Co', type: 'Distributor', country: 'USA', appliedDate: '2024-03-02', status: 'Pending' },
  { id: 'v-103', name: 'Eco Industrial', type: 'Manufacturer', country: 'Japan', appliedDate: '2024-03-03', status: 'Pending' },
];

export const MODERATION_PRODUCTS = [
  { id: 'p-501', name: 'High-Pressure Steam Valve', vendor: 'Global Tools Inc', category: 'Industrial Parts', submittedDate: '2024-03-01', status: 'In Review' },
  { id: 'p-502', name: 'Heavy Duty Crane Hook', vendor: 'SteelWorks Machinery', category: 'Heavy Machinery', submittedDate: '2024-03-02', status: 'In Review' },
  { id: 'p-503', name: 'Industrial Safety Goggles', vendor: 'SafeGuard Pro', category: 'Safety Gear', submittedDate: '2024-03-03', status: 'In Review' },
];

export const CATEGORIES_LIST = [
  { id: 'cat-1', name: 'Power Tools', slug: 'power-tools', productCount: 12400, status: 'Active' },
  { id: 'cat-2', name: 'Heavy Machinery', slug: 'heavy-machinery', productCount: 3200, status: 'Active' },
  { id: 'cat-3', name: 'Safety Gear', slug: 'safety-gear', productCount: 8500, status: 'Active' },
  { id: 'cat-4', name: 'Hand Tools', slug: 'hand-tools', productCount: 15000, status: 'Active' },
];

export const COMMISSION_TIERS = [
  { id: 'tier-1', name: 'Standard', rate: 10, minVolume: 0, maxVolume: 25000 },
  { id: 'tier-2', name: 'Silver', rate: 8, minVolume: 25001, maxVolume: 100000 },
  { id: 'tier-3', name: 'Gold', rate: 5, minVolume: 100001, maxVolume: 1000000 },
];

export const ADMIN_DISPUTES = [
  { id: 'DISP-501', buyer: 'John Doe', vendor: 'SteelWorks Machinery', reason: 'Damaged Product', status: 'Open', date: '2024-03-01' },
  { id: 'DISP-502', buyer: 'Jane Smith', vendor: 'MaxPower Tools', reason: 'Late Delivery', status: 'In Progress', date: '2024-03-02' },
];
