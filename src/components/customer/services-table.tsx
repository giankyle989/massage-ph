import { Service } from '@prisma/client';

interface ServicesTableProps {
  services: Service[];
}

export function ServicesTable({ services }: ServicesTableProps) {
  if (services.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 pr-4 font-semibold text-gray-900">Service</th>
            <th className="pb-3 pr-4 font-semibold text-gray-900">Price</th>
            <th className="pb-3 pr-4 font-semibold text-gray-900">Duration</th>
            <th className="pb-3 font-semibold text-gray-900">Discount</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-gray-100">
              <td className="py-3 pr-4">
                <div className="font-medium text-gray-900">{service.name}</div>
                {service.description && (
                  <div className="mt-0.5 text-xs text-gray-500">{service.description}</div>
                )}
              </td>
              <td className="py-3 pr-4 text-gray-700">
                &#8369;{Number(service.price).toLocaleString()}
              </td>
              <td className="py-3 pr-4 text-gray-700">{service.duration} min</td>
              <td className="py-3 text-gray-700">{formatDiscount(service)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDiscount(service: Service): string {
  if (!service.discount || !service.discountType) return '\u2014';
  const value = Number(service.discount);
  if (service.discountType === 'percentage') return `${value}% off`;
  if (service.discountType === 'fixed') return `\u20B1${value.toLocaleString()} off`;
  return '\u2014';
}
