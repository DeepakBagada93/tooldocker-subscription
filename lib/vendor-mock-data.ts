export const VENDOR_STATS = {
  totalRevenue: 125400.50,
  totalOrders: 452,
  activeProducts: 24,
  payoutPending: 12450.00,
  revenueData: [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 15000 },
    { name: 'Mar', revenue: 18000 },
    { name: 'Apr', revenue: 14000 },
    { name: 'May', revenue: 22000 },
    { name: 'Jun', revenue: 25000 },
  ],
  topProducts: [
    { id: 'p1', name: 'Industrial Grade Arc Welder 400A', sales: 45, revenue: 58499.55 },
    { id: 'p3', name: 'Professional Impact Wrench Kit', sales: 128, revenue: 44798.72 },
    { id: 'p2', name: 'Hydraulic Excavator Bucket 24"', sales: 5, revenue: 12250.00 },
  ]
};

export const VENDOR_PRODUCTS = [
  { id: 'p1', name: 'Industrial Grade Arc Welder 400A', price: 1299.99, stock: 12, status: 'Active', category: 'Welding' },
  { id: 'p2', name: 'Hydraulic Excavator Bucket 24"', price: 2450.00, stock: 5, status: 'Active', category: 'Heavy Machinery' },
  { id: 'p3', name: 'Professional Impact Wrench Kit', price: 349.99, stock: 45, status: 'Active', category: 'Power Tools' },
  { id: 'p4', name: 'Safety Harness', price: 89.50, stock: 0, status: 'Out of Stock', category: 'Safety' },
];

export const VENDOR_ORDERS = [
  { id: 'ORD-9921', customer: 'John Doe', date: '2024-03-03', total: 1299.99, status: 'Processing' },
  { id: 'ORD-9920', customer: 'Jane Smith', date: '2024-03-02', total: 349.99, status: 'Shipped' },
  { id: 'ORD-9919', customer: 'Bob Johnson', date: '2024-03-01', total: 2450.00, status: 'Delivered' },
];

export const PAYOUT_HISTORY = [
  { id: 'PAY-001', date: '2024-02-28', amount: 15400.00, status: 'Completed' },
  { id: 'PAY-002', date: '2024-02-15', amount: 12000.00, status: 'Completed' },
  { id: 'PAY-003', date: '2024-01-31', amount: 18500.00, status: 'Completed' },
];

export const COMMISSION_BREAKDOWN = [
  { id: 'ORD-9921', amount: 1299.99, commission: 129.99, platformFee: 13.00, net: 1157.00 },
  { id: 'ORD-9920', amount: 349.99, commission: 34.99, platformFee: 3.50, net: 311.50 },
];
