export const CUSTOMER_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const RATE_LIMIT_PUBLIC = 100; // requests per minute
export const RATE_LIMIT_ADMIN = 60;
export const RATE_LIMIT_UPLOAD = 20;

export const PREDEFINED_CATEGORIES = [
  'Thai Massage',
  'Chinese Massage',
  'Swedish Massage',
  'Shiatsu',
  'Hilot (Filipino Traditional)',
  'Deep Tissue',
  'Aromatherapy',
  'Hot Stone',
  'Sports Massage',
  'Reflexology',
  'Prenatal Massage',
  'Combination / Multi-style',
] as const;

export const PREDEFINED_TAGS = [
  '24/7',
  'Pet Friendly',
  'Parking Available',
  'WiFi Available',
  'Home Service',
  'Couple Massage',
  'Senior Discount',
  'Student Discount',
  'Walk-In Welcome',
  'By Appointment Only',
  'Male Therapist',
  'Female Therapist',
  'Wheelchair Accessible',
  'Credit Card Accepted',
  'GCash Accepted',
] as const;
