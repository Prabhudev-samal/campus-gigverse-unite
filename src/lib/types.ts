export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  university: string;
  profilePic: string;
  bio: string;
  skills: string[];
  isFreelancer: boolean;
}

export interface Gig {
  id: string;
  userId: string;
  title: string;
  desc: string;
  category: string;
  price: number;
  cover: string;
  deliveryTime: number;
  features: string[];
  totalStars: number;
  starNumber: number;
  sales: number;
  sellerName: string;
  sellerPic: string;
}

export interface Order {
  id: string;
  gigId: string;
  title: string;
  price: number;
  sellerId: string;
  buyerId: string;
  isCompleted: boolean;
  createdAt: string;
  sellerName?: string;
  buyerName?: string;
  cover?: string;
}

export interface Review {
  id: string;
  gigId: string;
  userId: string;
  userName: string;
  userPic: string;
  star: number;
  desc: string;
  createdAt: string;
}

export const CATEGORIES = [
  { name: "Web Development", icon: "🌐", slug: "web-development" },
  { name: "Graphic Design", icon: "🎨", slug: "graphic-design" },
  { name: "Content Writing", icon: "✍️", slug: "content-writing" },
  { name: "Video Editing", icon: "🎬", slug: "video-editing" },
  { name: "Tutoring", icon: "📚", slug: "tutoring" },
  { name: "Data Analysis", icon: "📊", slug: "data-analysis" },
  { name: "Music & Audio", icon: "🎵", slug: "music-audio" },
  { name: "Photography", icon: "📷", slug: "photography" },
  { name: "App Development", icon: "📱", slug: "app-development" },
  { name: "Translation", icon: "🌍", slug: "translation" },
  { name: "Resume & CV", icon: "📄", slug: "resume-cv" },
  { name: "Event Planning", icon: "🎉", slug: "event-planning" },
];