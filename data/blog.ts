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
    id: "sell-house-needing-repairs",
    category: "Selling Tips",
    readTime: "6 Min Read",
    title: "How to sell a house that needs repairs",
    authorName: "Jonah Stevens",
    authorRole: "Founder, Royal Home Solutions",
    authorAvatar: "/Assets/Images/Jonah%20Stevens%204.jpg",
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Older home that may need some repairs before selling",
  },
  {
    id: "before-accepting-cash-offer",
    category: "Cash Offers",
    readTime: "5 Min Read",
    title: "What to know before accepting a cash offer",
    authorName: "Royal Home Solutions Team",
    authorRole: "Homeowner Resources",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    image:
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Bright modern home exterior on a clear day",
  },
  {
    id: "selling-inherited-property",
    category: "Inherited Homes",
    readTime: "6 Min Read",
    title: "Selling an inherited property: simple next steps",
    authorName: "Royal Home Solutions Team",
    authorRole: "Homeowner Resources",
    authorAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Suburban family home that has been passed down",
  },
];
