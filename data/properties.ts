export interface Property {
  id: string;
  name: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  /** Living area in square metres. */
  area: number;
  status: "For Sale" | "For Rent" | "Sold";
  image: string;
  imageAlt: string;
}

export const properties: Property[] = [
  {
    id: "aspen-nest-home",
    name: "Aspen Nest Home",
    price: 400000,
    address: "42 Birch Boulevard, Mississauga, ON",
    bedrooms: 3,
    bathrooms: 2,
    area: 680,
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Two-storey brick family home beside a calm lake",
  },
  {
    id: "the-grand-haven",
    name: "The Grand Haven",
    price: 619000,
    address: "1220C Queen Street West, Toronto, ON",
    bedrooms: 3,
    bathrooms: 3,
    area: 740,
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "White coastal-style house with a wraparound porch",
  },
  {
    id: "maple-residence",
    name: "Maple Residence",
    price: 245000,
    address: "458 King Avenue West, Toronto, ON",
    bedrooms: 4,
    bathrooms: 3,
    area: 820,
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Classic grey residence surrounded by tall trees",
  },
  {
    id: "oakwood-villa",
    name: "Oakwood Villa",
    price: 175500,
    address: "220 Queen Street North, Ottawa, ON",
    bedrooms: 4,
    bathrooms: 4,
    area: 820,
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Suburban villa with a double garage and manicured lawn",
  },
  {
    id: "sunset-haven",
    name: "Sunset Haven",
    price: 310000,
    address: "98 Lakeview Drive, Vancouver, BC",
    bedrooms: 5,
    bathrooms: 3,
    area: 820,
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern lakeview home glowing at sunset",
  },
];
