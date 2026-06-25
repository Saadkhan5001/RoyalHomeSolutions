export interface BlogPost {
  id: string;
  category: string;
  readTime: string;
  title: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  image: string;
  imageAlt: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "property-taxes-hidden-costs",
    category: "Property Insights",
    readTime: "12 Min Read",
    title: "Understanding property taxes and hidden costs of homeownership",
    authorName: "Jane Smith",
    authorRole: "Senior Property Consultant",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Two people reviewing documents on a laptop together",
  },
  {
    id: "eco-friendly-homes",
    category: "Market Trends",
    readTime: "11 Min Read",
    title: "Eco-friendly homes: how to make your property more sustainable",
    authorName: "Daniel Brooks",
    authorRole: "Real Estate Analyst",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Hand signing paperwork at a desk",
  },
  {
    id: "real-estate-news-tips",
    category: "Investment Guide",
    readTime: "12 Min Read",
    title: "Real estate news, tips, trends, and market insights",
    authorName: "Emily Johnson",
    authorRole: "Investment Advisor",
    authorAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Two colleagues working together on laptops at a table",
  },
];
