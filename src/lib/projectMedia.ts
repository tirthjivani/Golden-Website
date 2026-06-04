// Source of truth for project page image ORDER and section VISIBILITY.
// Slot index -> section: 0 = Hero, 1-4 = Overview, 5 = Amenities, 6-14 = Gallery.

type FolderKey =
  | "GoldenLuxuria"
  | "GoldenHeaven"
  | "GoldenHomes"
  | "GoldenNirvana"
  | "GoldenPalmPlaza"
  | "GoldenPalmVilla"
  | "GoldenResidency"
  | "GoldenSquareAnkleshwar"
  | "GoldenSquareBharuch"
  | "GoldenVilla";

type SectionKey = "hero" | "overview" | "amenities" | "gallery";

type SlotMap = Partial<Record<string, string>>;
type HiddenMap = Partial<Record<SectionKey, true>>;

const SLOTS: Record<FolderKey, SlotMap> = {
  GoldenLuxuria: {
    "0": "Building_Front_Elevation_Courtyard_View.webp",
    "1": "Main_Entrance_Gate_Day_Perspective.webp",
    "2": "Building_Full_Front_Elevation_Golden_Hour.webp",
    "3": "Interior_Entrance_Lobby_Reception.webp",
    "4": "Landscape_Zen_Garden_Buddha_Statue.webp",
    "5": "Landscape_Garden_Walking_Track.webp",
    "7": "Building_Side_Elevation_Daylight.webp",
    "8": "Children_Play_Area_Community_Park.webp",
    "9": "Interior_Fitness_Gym_Amenities.webp",
    "10": "Interior_Recreation_Indoor_Games_Room.webp",
    "11": "Landscape_Garden_Walking_Track.webp",
    "13": "Interior_Entrance_Lobby_Reception.webp",
    "14": "Interior_Banquet_Hall_Formal_Setup.webp",
  },
  GoldenHeaven: {
    "0": "Building_Full_Elevation_Twilight.webp",
    "1": "Main_Entrance_Gate_Day_View.webp",
    "2": "Building_Front_Perspective_Daylight.webp",
    "3": "Garden_Landscaping_Water_Feature.webp",
    "4": "Interiors_Gymnasium 2.webp",
    "5": "Garden_Seating_Aesthetic_Bench.webp",
    "6": "Children_Play_Area_Aerial.webp",
    "7": "Residential_Complex_Birdview_Aerial.webp",
    "8": "Interiors_Indoor_Games 2.webp",
    "9": "Garden_Landscaping_Lawn_Area.webp",
    "10": "Sunken_Seating_and_Parking.webp",
    "11": "Interiors_Banquet_Hall 2.webp",
    "12": "Children_Play_Area_Amenities.webp",
  },
  GoldenHomes: {
    "0": "Bungalow_Full_Front_View_Night.webp",
    "1": "Community_Park_Area_Amenities.webp",
    "2": "Bungalow_Entrance_Parking_View.webp",
    "3": "Bungalow_Full_Front_View_Day.webp",
    "4": "Residential_Layout_Birdview_Aerial.webp",
    "5": "Bungalow_Internal_Road_Perspective.webp",
    "6": "Bungalow_Side_Elevation_Landscaping.webp",
  },
  GoldenNirvana: {
    "0": "Building_Side_Front_Corner_Perspective.webp",
    "1": "Main_Entrance_Gate.webp",
    "2": "Landscape_Garden_Zen_Seating_Area.webp",
    "3": "Garden_and_Tower_View.webp",
    "4": "Bungalow_Entrance_Parking_Day.webp",
    "5": "Landscape_Garden_Sunken_Seating.webp",
    "6": "Bungalow_Internal_Road_Parking_View.webp",
    "7": "Amenity_Area_Aerial.webp",
    "8": "Landscape_Garden_Aesthetic_Seating.webp",
    "9": "Bungalow_Main_Front_Elevation_Perspective.webp",
    "10": "Community_Park_Aerial_Birdview.webp",
    "11": "Community_Park_Children_Play_Area_Detail.webp",
    "12": "Community_Park_Ground_Perspective.webp",
    "13": "Exterior_Frontage_Aerial.webp",
    "14": "Residential_Complex_Birdview_Night_Aerial.webp",
  },
  GoldenPalmPlaza: {
    "0": "Commercial_Plaza_Gate_Side_Night_Perspective.webp",
    "1": "Commercial_Plaza_Main_Front_Elevation_Day.webp",
  },
  GoldenPalmVilla: {
    "0": "Bungalow_Street_Landscape_Night_Perspective.webp",
    "1": "Community_Park_And_Landscaping_Aerial.webp",
    "2": "Bungalow_Street_Level_Day_View.webp",
    "3": "Landscape_Garden_Gazebo_and_Waterpond.webp",
  },
  GoldenResidency: {
    "0": "Building_Full_Front_Elevation_Day.webp",
    "1": "Building_Side_Elevation_Daylight.webp",
    "2": "Residential_Complex_Birdview_Aerial.webp",
  },
  GoldenSquareAnkleshwar: {
    "0": "Building_Main_Front_Elevation_Day.webp",
    "1": "Interior_Courtyard_Seating_Area.webp",
    "2": "Building_Street_Perspective_View.webp",
    "3": "Interior_Atrium_Mall_View.webp",
    "4": "Interior_Mall_Retail_Floor.webp",
    "5": "Interior_Office_Block_Atrium.webp",
  },
  GoldenSquareBharuch: {
    "0": "Building_Street_Perspective_View.webp",
    "1": "new Cam_09.webp",
    "2": "Entrance Foyer-Final.webp",
    "3": "Exterior_Walkway_Ivy_Lights.webp",
    "4": "Food court-04.webp",
    "5": "Theater lobby-06.webp",
    "6": "Building_Front_Daylight_Full_Elevation.webp",
    "7": "Cinemas entry-01.webp",
    "8": "Passage.webp",
    "9": "Interior_Atrium_Mall_View.webp",
    "11": "Entrance_Parking_Ramp_Close_up.webp",
  },
  GoldenVilla: {
    "0": "Bungalow_Main_Front_Elevation_Night.webp",
    "1": "Main_Entrance_Gate_Day_Perspective.webp",
    "2": "Residential_Layout_Birdview_Aerial.webp",
    "3": "Landscape_Garden_Seating_Ground_View.webp",
    "4": "Landscape_Zen_Garden_Buddha_Statue.webp",
    "5": "Community_Park_Aerial_Birdview.webp",
    "6": "Bungalow_Main_Front_Elevation_Day.webp",
    "7": "Bungalow_Full_Front_View_Daylight.webp",
  },
};

const HIDDEN: Record<FolderKey, HiddenMap> = {
  GoldenLuxuria: {},
  GoldenHeaven: {},
  GoldenHomes: {},
  GoldenNirvana: {},
  GoldenPalmPlaza: { amenities: true, gallery: true },
  GoldenPalmVilla: { amenities: true, gallery: true },
  GoldenResidency: { amenities: true, gallery: true },
  GoldenSquareAnkleshwar: { gallery: true },
  GoldenSquareBharuch: {},
  GoldenVilla: {},
};

const SLUG_TO_FOLDER: Record<string, FolderKey> = {
  "golden-luxuria": "GoldenLuxuria",
  "golden-heaven": "GoldenHeaven",
  "golden-homes": "GoldenHomes",
  "golden-nirvana": "GoldenNirvana",
  "golden-palm-plaza": "GoldenPalmPlaza",
  "golden-palm-villa": "GoldenPalmVilla",
  "golden-residency": "GoldenResidency",
  "golden-square": "GoldenSquareAnkleshwar",
  "golden-square-bharuch": "GoldenSquareBharuch",
  "golden-villa": "GoldenVilla",
};

export type ProjectMedia = {
  hero?: string;
  overview: string[];
  amenities?: string;
  gallery: string[];
  hidden: HiddenMap;
};

export function getProjectMedia(slug: string): ProjectMedia | null {
  const folder = SLUG_TO_FOLDER[slug];
  if (!folder) return null;
  const slots = SLOTS[folder];
  const hidden = HIDDEN[folder];

  const at = (i: number): string | undefined => slots[String(i)];

  const overview: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const f = at(i);
    if (f) overview.push(f);
  }
  const gallery: string[] = [];
  for (let i = 6; i <= 14; i++) {
    const f = at(i);
    if (f) gallery.push(f);
  }

  return {
    hero: at(0),
    overview,
    amenities: at(5),
    gallery,
    hidden,
  };
}
