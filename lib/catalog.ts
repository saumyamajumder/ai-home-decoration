import {
  Armchair,
  Bath,
  BedDouble,
  Briefcase,
  ChefHat,
  Flower2,
  Home,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { photos } from "@/lib/images";

export type RoomCategoryId =
  | "kitchen"
  | "bedroom"
  | "living-room"
  | "bathroom"
  | "dining-room"
  | "office"
  | "garden"
  | "exterior";

export interface RoomCategory {
  id: RoomCategoryId;
  name: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

export const roomCategories: RoomCategory[] = [
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Cabinets, counters, appliances",
    image: photos.kitchenModern,
    icon: ChefHat,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    description: "Beds, lighting, textiles",
    image: photos.bedroomLuxury,
    icon: BedDouble,
  },
  {
    id: "living-room",
    name: "Living Room",
    description: "Seating, layout, decor",
    image: photos.livingGrey,
    icon: Armchair,
  },
  {
    id: "bathroom",
    name: "Bathroom",
    description: "Tiles, vanities, fixtures",
    image: photos.bathroomModern,
    icon: Bath,
  },
  {
    id: "dining-room",
    name: "Dining Room",
    description: "Tables, chairs, pendants",
    image: photos.dining,
    icon: UtensilsCrossed,
  },
  {
    id: "office",
    name: "Office",
    description: "Desks, storage, focus zones",
    image: photos.office,
    icon: Briefcase,
  },
  {
    id: "garden",
    name: "Garden",
    description: "Planting, paths, seating",
    image: photos.garden,
    icon: Flower2,
  },
  {
    id: "exterior",
    name: "Exterior",
    description: "Facades, cladding, entrances",
    image: photos.exterior,
    icon: Home,
  },
];

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const designStyles: DesignStyle[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean lines, open space, neutral palette",
    image: photos.livingModern,
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light woods, soft whites, cosy textiles",
    image: photos.livingScandi,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Only what matters, calm and uncluttered",
    image: photos.bedroomMinimal,
  },
  {
    id: "japandi",
    name: "Japandi",
    description: "Warm minimalism with natural textures",
    image: photos.livingJapandi,
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Layered patterns, plants and warmth",
    image: photos.bedroomBoho,
  },
  {
    id: "mid-century",
    name: "Mid-Century",
    description: "Organic shapes, walnut and brass",
    image: photos.livingMidCentury,
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Classic details, tufting, symmetry",
    image: photos.bedroomTraditional,
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Bold accents on a crisp backdrop",
    image: photos.livingContemporary,
  },
];
