export interface Testimonial {
  id: string;
  name: string;
  role: string;
  /** Rating out of 5; supports halves, e.g. 4.5. */
  rating: number;
  quote: string;
  propertyName: string;
  propertyAddress: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "valentine-alagnat",
    name: "Valentine Alagnat",
    role: "IT Purchasing Manager, Invert",
    rating: 4.5,
    quote:
      "Outstanding service and dedication—Havenly delivered as promised and consistently exceeded our expectations.",
    propertyName: "The Grand Haven",
    propertyAddress: "1220C Queen Street West · Toronto",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "sophia-carter",
    name: "Sophia Carter",
    role: "Luxury Home Buyer · Miami",
    rating: 5,
    quote:
      "Havenly made our home-buying journey truly seamless, stress-free, and perfectly tailored to our needs.",
    propertyName: "Palm Crest Residences",
    propertyAddress: "45 Ocean Drive West · Miami",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "marcus-lee",
    name: "Marcus Lee",
    role: "First-Time Buyer · Vancouver",
    rating: 5,
    quote:
      "From the first viewing to closing day, the team made everything clear and easy. I never felt lost in the process.",
    propertyName: "Sunset Haven",
    propertyAddress: "98 Lakeview Drive · Vancouver",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    role: "Property Investor · Ottawa",
    rating: 4.5,
    quote:
      "Their market insight helped me invest with confidence. Honest advice and genuine care at every step.",
    propertyName: "Oakwood Villa",
    propertyAddress: "220 Queen Street North · Ottawa",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
];
