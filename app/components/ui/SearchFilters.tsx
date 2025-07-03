"use client";

import type { Room } from '@/types/room';

interface FilterType {
  minPrice: number;
  maxPrice: number;
  amenities: string[];
}

interface SearchFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}


const AMENITIES: Room['amenities'][number][] = [
  'WiFi',
  'Pool',
  'Gym',
  'Breakfast',
  'Air Conditioning',
];

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    onFilterChange({ ...filters, amenities: newAmenities });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-medium text-lg mb-4">Filters</h3>
      
      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="flex items-center justify-between mb-2">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              maxPrice: Number(e.target.value) 
            })}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Amenities */}
        <div>
          <h4 className="font-medium mb-3">Amenities</h4>
          <div className="space-y-2">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => onFilterChange({ 
            minPrice: 0, 
            maxPrice: 1000, 
            amenities: [] 
          })}
          className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}