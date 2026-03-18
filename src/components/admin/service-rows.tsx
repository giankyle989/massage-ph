'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ServiceInput } from '@/lib/validators';

type ServiceRow = {
  name: string;
  price: string;
  duration: string;
  discountType: 'none' | 'percentage' | 'fixed';
  discount: string;
  description: string;
};

export function toServiceRow(s?: Partial<ServiceInput>): ServiceRow {
  return {
    name: s?.name ?? '',
    price: s?.price != null ? String(s.price) : '',
    duration: s?.duration != null ? String(s.duration) : '',
    discountType:
      s?.discountType === 'percentage' || s?.discountType === 'fixed' ? s.discountType : 'none',
    discount: s?.discount != null ? String(s.discount) : '',
    description: s?.description ?? '',
  };
}

export function fromServiceRow(row: ServiceRow): ServiceInput {
  return {
    name: row.name,
    price: Number(row.price),
    duration: Number(row.duration),
    discountType: row.discountType === 'none' ? null : row.discountType,
    discount: row.discountType === 'none' || !row.discount ? null : Number(row.discount),
    description: row.description || null,
  };
}

interface ServiceRowsProps {
  rows: ServiceRow[];
  onChange: (rows: ServiceRow[]) => void;
  error?: string;
}

export type { ServiceRow };

export function ServiceRows({ rows, onChange, error }: ServiceRowsProps) {
  const updateRow = (index: number, field: keyof ServiceRow, value: string) => {
    const updated = rows.map((row, i) => (i === index ? { ...row, [field]: value } : row));
    onChange(updated);
  };

  const addRow = () => {
    onChange([...rows, toServiceRow()]);
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Services</h3>
        <Button type="button" variant="secondary" size="sm" onClick={addRow}>
          + Add Service
        </Button>
      </div>

      {rows.length === 0 && error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {rows.map((row, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Service {index + 1}</span>
            <Button type="button" variant="danger" size="sm" onClick={() => removeRow(index)}>
              Remove
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label="Service Name"
              value={row.name}
              onChange={(e) => updateRow(index, 'name', e.target.value)}
              required
            />
            <Input
              label="Price (₱)"
              type="number"
              min="0"
              step="0.01"
              value={row.price}
              onChange={(e) => updateRow(index, 'price', e.target.value)}
              required
            />
            <Input
              label="Duration (min)"
              type="number"
              min="1"
              value={row.duration}
              onChange={(e) => updateRow(index, 'duration', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Discount Type</label>
              <select
                value={row.discountType}
                onChange={(e) =>
                  updateRow(index, 'discountType', e.target.value as ServiceRow['discountType'])
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="none">None</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <Input
              label="Discount Amount"
              type="number"
              min="0"
              step="0.01"
              value={row.discount}
              onChange={(e) => updateRow(index, 'discount', e.target.value)}
              disabled={row.discountType === 'none'}
            />

            <Input
              label="Description (optional)"
              value={row.description}
              onChange={(e) => updateRow(index, 'description', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
