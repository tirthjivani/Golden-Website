// Central project catalogue. Treat this file as the database snapshot — the
// shape here mirrors the CMS schema we'll back it with later. Image paths are
// stored as keys under `projects/<slug>/...` so they can resolve to the local
// `public/` tree today and a Cloudflare CDN tomorrow without touching pages.

const RAW_CDN_BASE = process.env.NEXT_PUBLIC_PROJECT_IMAGE_BASE ?? "/projects";

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function projectImage(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  return `${trimSlash(RAW_CDN_BASE)}/${path}`;
}

export type ProjectType = "residential" | "commercial-industrial";
export type ProjectStatus = "Completed" | "Ongoing" | "Upcoming";

export type ImageRef = {
  src: string;
  alt?: string;
  caption?: string;
};

export type AmenityKey =
  | "walking-track"
  | "security"
  | "solar-power"
  | "garden"
  | "play-area"
  | "elevators"
  | "parking"
  | "gym"
  | "pool"
  | "clubhouse"
  | "library";

export type FloorPlan = {
  id: string;
  label: string;
  metrics: { label: string; value: string }[];
  features: string[];
  image: ImageRef;
  note?: string;
};

export type FloorPlanGroup = {
  id: string;
  label: string;
  plans: FloorPlan[];
};

export type SpecificationItem = {
  id: string;
  title: string;
  body: string;
};

export type LocationPin = {
  label: string;
  minutes: number;
  category?: "Park" | "School" | "Hospital" | "Transit" | "Market" | "Other";
};

export type Pillar = {
  id: string;
  title: string;
  body: string;
  iconKey: "zero-out" | "smart-power" | "climate-capsule";
};

export type ProjectDetail = {
  hero: {
    image: ImageRef;
    eyebrow?: string;
    tagline?: string;
  };
  firstLook?: {
    headline?: string;
    items: ImageRef[];
  };
  intro: {
    headline: string;
    body?: string;
    brochureUrl?: string;
  };
  highlights?: {
    headline: string;
    body?: string;
    items: ImageRef[];
  };
  amenities: {
    headline: string;
    body?: string;
    feature: ImageRef;
    items: { key: AmenityKey; label: string }[];
  };
  masterPlan?: {
    headline: string;
    body?: string;
    image: ImageRef;
  };
  floorPlans: {
    headline: string;
    body?: string;
    groups: FloorPlanGroup[];
  };
  specifications: {
    headline: string;
    body?: string;
    items: SpecificationItem[];
  };
  gallery: {
    headline: string;
    body?: string;
    images: ImageRef[];
  };
  location: {
    headline: string;
    body?: string;
    map: ImageRef;
    address?: string;
    pins: LocationPin[];
  };
  pillars: {
    items: Pillar[];
  };
  walkthrough: {
    headline: string;
    body?: string;
    image: ImageRef;
    videoUrl?: string;
  };
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  type: ProjectType;
  category: string;
  location: string;
  area: string;
  status: ProjectStatus;
  rera?: string;
  images: ImageRef[];
  detail?: ProjectDetail;
};

// ---------- Shared building blocks ----------

const PILLARS_DEFAULT: Pillar[] = [
  {
    id: "zero-out",
    title: "Zero Out",
    body: "Designed to drop your monthly energy and water bills to near zero through passive design choices.",
    iconKey: "zero-out",
  },
  {
    id: "smart-power",
    title: "Smart Power",
    body: "Solar generation paired with energy-efficient fixtures keep the lights on without the spike.",
    iconKey: "smart-power",
  },
  {
    id: "zero-waste",
    title: "Zero Waste",
    body: "Rainwater harvesting and on-site treatment loop water back into landscaping and amenities.",
    iconKey: "zero-out",
  },
  {
    id: "climate-capsule",
    title: "Climate Capsule",
    body: "Cross-ventilation, shaded glazing, and high-mass walls hold temperature without heavy AC use.",
    iconKey: "climate-capsule",
  },
];

const AMENITIES_RESIDENTIAL: ProjectDetail["amenities"]["items"] = [
  { key: "walking-track", label: "Walking Track" },
  { key: "security", label: "24x7 Security" },
  { key: "solar-power", label: "Solar Power" },
  { key: "garden", label: "Landscaped Garden" },
  { key: "play-area", label: "Children's Play Area" },
  { key: "elevators", label: "Elevators" },
  { key: "parking", label: "Parking" },
  { key: "gym", label: "Gymnasium" },
];

const AMENITIES_COMMERCIAL: ProjectDetail["amenities"]["items"] = [
  { key: "elevators", label: "High-speed Elevators" },
  { key: "security", label: "24x7 Security" },
  { key: "parking", label: "Visitor Parking" },
  { key: "solar-power", label: "Power Backup" },
];

const LOCATION_PINS_DEFAULT: LocationPin[] = [
  { label: "Park", minutes: 5, category: "Park" },
  { label: "School", minutes: 10, category: "School" },
  { label: "Hospital", minutes: 15, category: "Hospital" },
  { label: "Highway", minutes: 8, category: "Transit" },
  { label: "Market", minutes: 6, category: "Market" },
];

function specs(...rows: [string, string][]): SpecificationItem[] {
  return rows.map(([title, body]) => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    title,
    body,
  }));
}

// ---------- Project records ----------

const goldenLuxuria: Project = {
  id: "golden-luxuria",
  slug: "golden-luxuria",
  name: "Golden Luxuria",
  type: "residential",
  category: "3 & 4 BHK Flats",
  location: "Bharuch",
  area: "1600 - 2400 Sq. Ft. (SBUA)",
  status: "Ongoing",
  images: [
    { src: "golden-luxuria/Main_Entrance_Gate_Day_Perspective.jpg" },
    { src: "golden-luxuria/Building_Full_Front_Elevation_Golden_Hour.jpg" },
    { src: "golden-luxuria/Interior_Entrance_Lobby_Reception.jpg" },
    { src: "golden-luxuria/Residential_Complex_Birdview_Aerial.jpg" },
  ],
  detail: {
    hero: {
      image: { src: "golden-luxuria/Building_Full_Front_Elevation_Golden_Hour.jpg" },
      eyebrow: "Premium Residences",
      tagline: "For those who never settled — this is the reward.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-luxuria/Main_Entrance_Gate_Day_Perspective.jpg", caption: "Main Entrance" },
        { src: "golden-luxuria/Building_Full_Front_Elevation_Golden_Hour.jpg", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "Premium residences designed for a life that has outgrown the ordinary.",
      body: "Welcome to the extraordinary everyday. Golden Luxuria brings together sweeping architecture, premium interiors, and resort-style amenities — for those who believe every day should feel like one worth remembering.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-luxuria/Interior_Entrance_Lobby_Reception.jpg", caption: "Grand entrance lobby" },
        { src: "golden-luxuria/Interior_Banquet_Hall_Formal_Setup.jpg", caption: "Private banquet hall" },
        { src: "golden-luxuria/Landscape_Zen_Garden_Buddha_Statue.jpg", caption: "Zen garden & meditation spaces" },
        { src: "golden-luxuria/Residential_Complex_Birdview_Aerial.jpg", caption: "3 BHK & 4 BHK residences" },
      ],
    },
    amenities: {
      headline: "Resort-style Amenities",
      body: "From quiet zen gardens to a private banquet hall, every shared space is engineered to make daily life feel a little more thoughtful.",
      feature: { src: "golden-luxuria/Landscape_Garden_Walking_Track.jpg" },
      items: [
        { key: "walking-track", label: "Walking Track" },
        { key: "garden", label: "Zen Garden" },
        { key: "gym", label: "Fitness Gym" },
        { key: "play-area", label: "Children's Play Area" },
        { key: "clubhouse", label: "Banquet Hall" },
        { key: "elevators", label: "High-speed Lifts" },
        { key: "security", label: "24x7 Security" },
        { key: "parking", label: "Covered Parking" },
      ],
    },
    floorPlans: {
      headline: "Floor Plans",
      body: "Premium Residential Tower Layouts.",
      groups: [
        {
          id: "3bhk",
          label: "3 BHK (Tower A & C)",
          plans: [
            {
              id: "3bhk-type-1",
              label: "3 BHK",
              metrics: [
                { label: "SBUA", value: "1600 SQ.FT." },
                { label: "TCA", value: "1177 SQ.FT." },
                { label: "Carpet (C.A.)", value: "1133.58 SQ.FT." },
              ],
              features: [
                "Triple Bedroom configuration with a Master Bedroom (10'0\" x 14'0\").",
                "Expansive Living and Dining area (11'6\" x 23'6\") for luxury living.",
                "Dedicated standing deck (5'0\" wide) for outdoor views.",
                "Large Kitchen with 3'4.5\" wide platform and connected wash area.",
              ],
              image: { src: "golden-luxuria/3bhk_typical_unit.png" },
              note: "*SBUA estimated at ~1.36x Carpet. Final dimensions may vary on site.",
            },
          ],
        },
        {
          id: "4bhk",
          label: "4 BHK (Tower B)",
          plans: [
            {
              id: "4bhk-type-1",
              label: "4 BHK",
              metrics: [
                { label: "SBUA", value: "2400 SQ.FT." },
                { label: "TCA", value: "1776 SQ.FT." },
                { label: "Carpet (C.A.)", value: "1714.49 SQ.FT." },
              ],
              features: [
                "Multi-Master Suite configuration (17'0\" x 11'0\" and 10'0\" x 14'0\").",
                "Integrated Servant Room with separate toilet for high-end functionality.",
                "Massive Living Room (13'0\" x 23'0\") with attached premium deck.",
                "Four dedicated bathrooms plus additional powder/servant facilities.",
              ],
              image: { src: "golden-luxuria/2bhk_typical_unit.png" },
              note: "*SBUA estimated at ~1.35x Carpet.",
            },
          ],
        },
        {
          id: "typical",
          label: "Typical Floor",
          plans: [
            {
              id: "typical-floor",
              label: "Typical Floor Plate",
              metrics: [
                { label: "Configuration", value: "3 + 4 BHK" },
              ],
              features: [
                "Tower A & C: 3 BHK units.",
                "Tower B: 4 BHK units.",
                "Connected lobby and high-speed lifts on every floor.",
              ],
              image: { src: "golden-luxuria/typical_floor_plan.png" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      body: "Every detail, orchestrated for a life of balance and beauty.",
      items: specs(
        ["Structure", "RCC framed design following earthquake-resistant codes. Solid block masonry or high-quality brickwork for all wall partitions."],
        ["Architecture", "Contemporary facade with premium exterior textures. Granite or marble flooring in foyers and corridors. Interior walls with Birla white putty."],
        ["Plumbing & Electrical", "International standard CP & sanitary fittings (Kohler / Jaquar equivalent). Fire-retardant copper wiring with premium modular switches."],
        ["Windows & Doors", "Powder-coated aluminium windows with tinted glass. Flush doors with teak wood frames for a premium entrance experience."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at what awaits you.",
      images: [
        { src: "golden-luxuria/Building_Front_Elevation_Courtyard_View.jpg" },
        { src: "golden-luxuria/Building_Side_Elevation_Daylight.jpg" },
        { src: "golden-luxuria/Children_Play_Area_Community_Park.jpg" },
        { src: "golden-luxuria/Interior_Fitness_Gym_Amenities.jpg" },
        { src: "golden-luxuria/Interior_Recreation_Indoor_Games_Room.jpg" },
        { src: "golden-luxuria/Landscape_Garden_Walking_Track.jpg" },
        { src: "golden-luxuria/Landscape_Zen_Garden_Buddha_Statue.jpg" },
        { src: "golden-luxuria/Interior_Entrance_Lobby_Reception.jpg" },
      ],
    },
    masterPlan: {
      headline: "Master Plan",
      body: "Site layout and tower placement.",
      image: { src: "golden-luxuria/Project_Location_Map_and_Specifications.png" },
    },
    location: {
      headline: "Location",
      body: "Strategically located for connectivity and convenience in Bharuch.",
      map: { src: "" },
      address: "Bharuch, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      body: "Every detail, orchestrated for a life of balance and beauty.",
      image: { src: "golden-luxuria/Building_Full_Front_Elevation_Golden_Hour.jpg" },
    },
  },
};

const goldenHeaven: Project = {
  id: "golden-heaven",
  slug: "golden-heaven",
  name: "Golden Heaven",
  type: "residential",
  category: "1 & 2 BHK Flats",
  location: "Surat",
  area: "615 - 1000 Sq. Ft. (SBUA)",
  status: "Completed",
  images: [
    { src: "golden-heaven/Main_Entrance_Gate_Day_View.jpg" },
    { src: "golden-heaven/Building_Front_Perspective_Daylight.jpg" },
    { src: "golden-heaven/Building_Full_Elevation_Twilight.jpg" },
    { src: "golden-heaven/Residential_Complex_Birdview_Aerial.jpg" },
  ],
  detail: {
    hero: {
      image: { src: "golden-heaven/Building_Front_Perspective_Daylight.jpg" },
      eyebrow: "Family Residences",
      tagline: "Built for the family that earned this moment.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-heaven/Main_Entrance_Gate_Day_View.jpg", caption: "Main Entrance" },
        { src: "golden-heaven/Building_Front_Perspective_Daylight.jpg", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "Where modern living meets the warmth every home should carry.",
      body: "Welcome to Golden Heaven. A community that rises above the ordinary — where purposeful layouts meet lush open grounds and every amenity is a reason to come home.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-heaven/Building_Full_Elevation_Twilight.jpg", caption: "Twin-tower modern façade" },
        { src: "golden-heaven/Children_Play_Area_Amenities.jpg", caption: "Children's play & recreation zone" },
        { src: "golden-heaven/Garden_Landscaping_Lawn_Area.jpg", caption: "Landscaped gardens & open lawns" },
        { src: "golden-heaven/Residential_Complex_Birdview_Aerial.jpg", caption: "1 BHK & 2 BHK, 5 towers" },
      ],
    },
    amenities: {
      headline: "Everyday Amenities",
      body: "Spaces that turn a building into a community.",
      feature: { src: "golden-heaven/Garden_Landscaping_Water_Feature.jpg" },
      items: AMENITIES_RESIDENTIAL,
    },
    floorPlans: {
      headline: "Floor Plans",
      body: "Typical 1st to 7th Floor Layouts.",
      groups: [
        {
          id: "1bhk",
          label: "1 BHK (Tower B & C)",
          plans: [
            {
              id: "1bhk-typical",
              label: "1 BHK",
              metrics: [
                { label: "SBUA", value: "615 SQ.FT." },
                { label: "TCA", value: "459 SQ.FT." },
                { label: "Carpet (C.A.)", value: "438.30 SQ.FT." },
              ],
              features: [
                "Integrated Kitchen and Wash area for space efficiency.",
                "Living and Dining space of 10'0\" x 15'0\" for comfortable hosting.",
                "Master Bedroom (10'0\" x 12'0\") with attached ventilation balcony.",
                "Large common toilet (4'0\" x 6'6\") design.",
              ],
              image: { src: "golden-heaven/typical_plan.png" },
              note: "*SBUA estimated at ~1.35x Carpet.",
            },
          ],
        },
        {
          id: "2bhk",
          label: "2 BHK (Tower A, D & E)",
          plans: [
            {
              id: "2bhk-typical",
              label: "2 BHK",
              metrics: [
                { label: "SBUA", value: "1000 SQ.FT." },
                { label: "TCA", value: "730 SQ.FT." },
                { label: "Carpet (C.A.)", value: "705.51 SQ.FT." },
              ],
              features: [
                "Spacious Living Room (10'0\" x 16'0\") with separate Dining foyer.",
                "Two large Bedrooms (both 12'0\" x 10'0\") for family privacy.",
                "Master Bedroom features an attached toilet (4'0\" x 6'6\").",
                "Expansive Wash area (9'0\" x 4'6\") connected to the Kitchen.",
              ],
              image: { src: "golden-heaven/layout_plan.png" },
              note: "*SBUA estimated at ~1.37x Carpet.",
            },
          ],
        },
        {
          id: "typical",
          label: "Typical Floor",
          plans: [
            {
              id: "typical-plan",
              label: "Typical Floor Plate",
              metrics: [{ label: "Configuration", value: "1 + 2 BHK" }],
              features: [
                "1 BHK in Towers B & C, 2 BHK in Towers A, D & E.",
                "Tower core with two elevators and stair lobbies.",
              ],
              image: { src: "golden-heaven/typical_plan.png" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC framed earthquake-resistant structure designed for seismic loads. High-quality brickwork for internal and external walls."],
        ["Architecture", "Modern aesthetic with sand-face plaster exterior. Internal walls finished with smooth putty. Premium vitrified tile flooring."],
        ["Plumbing & Electrical", "Concealed plumbing with branded CP fittings. Concealed copper wiring with modular switches and MCB protection."],
        ["Windows & Doors", "Anodized aluminium sliding windows with safety grills. Decorative main door with wooden frame and flush doors for internals."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at what awaits you.",
      images: [
        { src: "golden-heaven/Children_Play_Area_Aerial.jpg" },
        { src: "golden-heaven/Garden_Landscaping_Water_Feature.jpg" },
        { src: "golden-heaven/Garden_Seating_Aesthetic_Bench.jpg" },
        { src: "golden-heaven/Sunken_Seating_and_Parking.jpg" },
        { src: "golden-heaven/Interiors_Banquet_Hall 2.png", alt: "Banquet hall" },
        { src: "golden-heaven/Interiors_Gymnasium 2.png", alt: "Gymnasium" },
        { src: "golden-heaven/Interiors_Indoor_Games 2.png", alt: "Indoor games" },
        { src: "golden-heaven/Building_Full_Elevation_Twilight.jpg" },
      ],
    },
    masterPlan: {
      headline: "Master Plan",
      body: "Township site layout across all 5 towers.",
      image: { src: "golden-heaven/layout_plan.png" },
    },
    location: {
      headline: "Location",
      body: "Located in Surat with quick access to schools, parks and the highway.",
      map: { src: "" },
      address: "Surat, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-heaven/Building_Full_Elevation_Twilight.jpg" },
    },
  },
};

const goldenNirvana: Project = {
  id: "golden-nirvana",
  slug: "golden-nirvana",
  name: "Golden Nirvana",
  type: "residential",
  category: "2 BHK Flats & 3 BHK Bungalows",
  location: "Surat",
  area: "950 - 1800 Sq. Ft. (SBUA)",
  status: "Ongoing",
  images: [
    { src: "golden-nirvana/Building_Low_Angle_Street_View.jpg" },
    { src: "golden-nirvana/Exterior_Frontage_Aerial.jpg" },
    { src: "golden-nirvana/Community_Park_Aerial_Birdview.jpg" },
    { src: "golden-nirvana/Bungalow_Main_Front_Elevation_Perspective.png" },
  ],
  detail: {
    hero: {
      image: { src: "golden-nirvana/Building_Low_Angle_Street_View.jpg" },
      eyebrow: "Township",
      tagline: "A township built around everything that matters.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-nirvana/Building_Low_Angle_Street_View.jpg", caption: "Main Entrance" },
        { src: "golden-nirvana/Bungalow_Main_Front_Elevation_Perspective.png", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "Where tower homes and private bungalows share a community worth coming home to.",
      body: "Find your pace. Find your place. Golden Nirvana is a full-scale township where verdant parks stretch between streetscapes and every corner is planned to bring peace to your daily life.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-nirvana/Exterior_Frontage_Aerial.jpg", caption: "2 BHK towers & private bungalows" },
        { src: "golden-nirvana/Community_Park_Aerial_Birdview.jpg", caption: "Open parks & community gardens" },
        { src: "golden-nirvana/Landscape_Garden_Zen_Seating_Area.jpg", caption: "Dedicated leisure & recreational zones" },
        { src: "golden-nirvana/Bungalow_Main_Front_Elevation_Perspective.png", caption: "3 BHK private bungalows" },
      ],
    },
    amenities: {
      headline: "Township Amenities",
      body: "Open parks, walking loops, and recreational pockets — all woven into the daily route.",
      feature: { src: "golden-nirvana/Garden_and_Tower_View.png" },
      items: AMENITIES_RESIDENTIAL,
    },
    floorPlans: {
      headline: "Floor Plans",
      body: "Integrated Residential Township Layouts.",
      groups: [
        {
          id: "2bhk",
          label: "2 BHK Tower",
          plans: [
            {
              id: "2bhk-typical",
              label: "2 BHK (Blocks A–E)",
              metrics: [
                { label: "SBUA", value: "950 SQ.FT." },
                { label: "TCA", value: "705 SQ.FT." },
                { label: "RCA", value: "680.00 SQ.FT." },
              ],
              features: [
                "Typical floor plan applicable from 2nd to 7th floor of blocks.",
                "Twin Bedroom suites both measuring 12'0\" x 10'0\" for equal comfort.",
                "Generous Kitchen/Dining combo (9'0\" x 13'6\") for modern workflows.",
                "Massive wash area (9'0\" x 4'6\") to accommodate all utility needs.",
              ],
              image: { src: "golden-nirvana/2bhk_typical_floor_plan_2nd_to_7th_floor_block_a,b,c,d,e.png" },
              note: "*SBUA estimated at ~1.35x Carpet.",
            },
          ],
        },
        {
          id: "bungalow",
          label: "3 BHK Bungalow",
          plans: [
            {
              id: "bungalow-ground",
              label: "Ground Floor",
              metrics: [
                { label: "Ground Floor", value: "622 SQ.FT." },
                { label: "Total Slab", value: "1334 SQ.FT." },
              ],
              features: [
                "Triple Bedroom private layout with ground and first floor separation.",
                "Private 8'0\" x 15'9\" parking and dedicated 6'0\" x 6'1.5\" garden space.",
              ],
              image: { src: "golden-nirvana/bungalow_ground_floor_layout_plan.png" },
            },
            {
              id: "bungalow-first",
              label: "First Floor",
              metrics: [
                { label: "First Floor", value: "622 SQ.FT." },
                { label: "Terrace", value: "90 SQ.FT." },
              ],
              features: [
                "Dedicated First Floor Store Room (6'0\" x 6'6\") for organized storage.",
                "Private Terrace (90 SQ.FT.) for outdoor relaxation and expansion.",
              ],
              image: { src: "golden-nirvana/bungalow_first_floor_layout_plan.png" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC framed structure designed for seismic stability. High-grade brick masonry for all wall systems."],
        ["Architecture", "Tiled or smooth-finish exteriors with modern color palettes. Premium vitrified tile flooring and gypsum-finished internal walls."],
        ["Plumbing & Electrical", "Superior CP and sanitary fittings in all bungalow and tower bathrooms. Concealed wiring with modular board systems."],
        ["Windows & Doors", "Premium aluminium windows with sliding mechanism. Large entrance doors with premium wood polish and designer hardware."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at what awaits you.",
      images: [
        { src: "golden-nirvana/Bungalow_Entrance_Parking_Day.jpg" },
        { src: "golden-nirvana/Bungalow_Internal_Road_Parking_View.png" },
        { src: "golden-nirvana/Childrens_Play_Area.png" },
        { src: "golden-nirvana/Community_Park_Children_Play_Area_Detail.png" },
        { src: "golden-nirvana/Community_Park_Ground_Perspective.jpg" },
        { src: "golden-nirvana/Amenity_Area_Aerial.png" },
        { src: "golden-nirvana/Building_Side_Front_Corner_Perspective.png" },
        { src: "golden-nirvana/Garden_and_Tower_View.png" },
      ],
    },
    masterPlan: {
      headline: "Master Plan",
      body: "Township layout — towers and bungalow plots.",
      image: { src: "golden-nirvana/ground_layout_plan_bungalow.png" },
    },
    location: {
      headline: "Location",
      body: "Strategically connected to the rest of Surat.",
      map: { src: "" },
      address: "Surat, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-nirvana/Exterior_Frontage_Aerial.jpg" },
    },
  },
};

const goldenVilla: Project = {
  id: "golden-villa",
  slug: "golden-villa",
  name: "Golden Villa",
  type: "residential",
  category: "4 BHK Row Villas (G + 2)",
  location: "Ankleshwar",
  area: "2000 Sq. Ft. (SBUA)",
  status: "Completed",
  images: [
    { src: "golden-villa/Main_Entrance_Gate_Day_Perspective.jpg" },
    { src: "golden-villa/Bungalow_Main_Front_Elevation_Day.jpg" },
    { src: "golden-villa/Community_Park_Aerial_Birdview.jpg" },
    { src: "golden-villa/Residential_Layout_Birdview_Aerial.jpg" },
  ],
  detail: {
    hero: {
      image: { src: "golden-villa/Bungalow_Main_Front_Elevation_Day.jpg" },
      eyebrow: "Row Villas",
      tagline: "Three floors of space, one address you will always be proud of.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-villa/Main_Entrance_Gate_Day_Perspective.jpg", caption: "Main Entrance" },
        { src: "golden-villa/Bungalow_Main_Front_Elevation_Day.jpg", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "Premium row villas where your family has room to live, grow, and thrive.",
      body: "Built wide. Built free. Golden Villa is a carefully planned row villa community with individual plots, landscaped common areas, and space that turns a neighbourhood into a home your family is proud of.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-villa/Community_Park_Aerial_Birdview.jpg", caption: "Landscaped community parks & walkways" },
        { src: "golden-villa/Landscape_Zen_Garden_Buddha_Statue.jpg", caption: "Zen garden & premium landscaping" },
        { src: "golden-villa/Landscape_Garden_Seating_Ground_View.jpg", caption: "Resident seating & relaxation areas" },
        { src: "golden-villa/Residential_Layout_Birdview_Aerial.jpg", caption: "4 BHK row villas, G+2 floors" },
      ],
    },
    amenities: {
      headline: "Community Amenities",
      body: "Designed for owners who value space and privacy.",
      feature: { src: "golden-villa/Community_Park_Aerial_Birdview.jpg" },
      items: AMENITIES_RESIDENTIAL,
    },
    floorPlans: {
      headline: "Floor Plans",
      body: "Premium 3-Level Row House Layouts.",
      groups: [
        {
          id: "ground",
          label: "Ground Floor",
          plans: [
            {
              id: "villa-ground",
              label: "4 BHK Row Villa — Ground",
              metrics: [
                { label: "SBUA", value: "2000 SQ.FT." },
                { label: "TCA", value: "1500 SQ.FT." },
                { label: "Per Plate", value: "~500-600 SQ.FT." },
              ],
              features: [
                "Expansive Ground Floor Living Room (12'0\" x 16'0\") with 10'10\" x 15' parking.",
                "Integrated Shopping Arcade (Golden Square) within the project vicinity.",
              ],
              image: { src: "golden-villa/ground_floor_plan.png" },
            },
          ],
        },
        {
          id: "first",
          label: "First Floor",
          plans: [
            {
              id: "villa-first",
              label: "4 BHK Row Villa — First",
              metrics: [{ label: "Plate", value: "~500-600 SQ.FT." }],
              features: [
                "Dual Bedroom private floor including a 13'6\" x 10' master suite.",
              ],
              image: { src: "golden-villa/first_floor_plan.png" },
            },
          ],
        },
        {
          id: "second",
          label: "Second Floor",
          plans: [
            {
              id: "villa-second",
              label: "4 BHK Row Villa — Second",
              metrics: [{ label: "Terrace", value: "~190 SQ.FT." }],
              features: [
                "Exclusive Second Floor Master Suite with 18'10.5\" x 10' open terrace.",
              ],
              image: { src: "golden-villa/1st_and_2nd_floor_plan.png" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC framed earthquake-resistant structure with multi-level load design. High-quality brickwork for all external and partition walls."],
        ["Architecture", "Striking modern elevation with exposed brick-texture finishes. Premium vitrified tiles and granite stairs with SS railings."],
        ["Plumbing & Electrical", "Designer CP and sanitary fittings. Concealed wiring with premium modular switches and points for high-end appliances."],
        ["Windows & Doors", "Large powder-coated aluminium windows for maximum light. Heavy-duty decorative main door with multi-point locking."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at what awaits you.",
      images: [
        { src: "golden-villa/Bungalow_Full_Front_View_Daylight.jpg" },
        { src: "golden-villa/Bungalow_Main_Front_Elevation_Night.jpg" },
        { src: "golden-villa/Bungalow_Side_Elevation_Perspective.jpg" },
        { src: "golden-villa/Landscape_Zen_Garden_Buddha_Statue.jpg" },
        { src: "golden-villa/Landscape_Garden_Seating_Ground_View.jpg" },
        { src: "golden-villa/Community_Park_Aerial_Birdview.jpg" },
        { src: "golden-villa/Main_Entrance_Gate_Day_Perspective.jpg" },
        { src: "golden-villa/Residential_Layout_Birdview_Aerial.jpg" },
      ],
    },
    masterPlan: {
      headline: "Master Plan",
      body: "Site layout across the row villa community.",
      image: { src: "golden-villa/layout_plan.png" },
    },
    location: {
      headline: "Location",
      body: "Located in Ankleshwar with quick access to GIDC and the city centre.",
      map: { src: "" },
      address: "Ankleshwar, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-villa/Bungalow_Main_Front_Elevation_Night.jpg" },
    },
  },
};

const goldenHomes: Project = {
  id: "golden-homes",
  slug: "golden-homes",
  name: "Golden Homes",
  type: "residential",
  category: "3 BHK Row Bungalows",
  location: "Ankleshwar",
  area: "1400 Sq. Ft. (SBUA)",
  status: "Completed",
  images: [
    { src: "golden-homes/Bungalow_Entrance_Parking_View.jpg" },
    { src: "golden-homes/Bungalow_Main_Front_Elevation_Day.jpg" },
    { src: "golden-homes/Bungalow_Full_Front_View_Day.jpg" },
    { src: "golden-homes/Residential_Layout_Birdview_Aerial.jpg" },
  ],
  detail: {
    hero: {
      image: { src: "golden-homes/Bungalow_Main_Front_Elevation_Day.jpg" },
      eyebrow: "Independent Bungalows",
      tagline: "Independent living, the way it was always meant to be.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-homes/Bungalow_Entrance_Parking_View.jpg", caption: "Main Entrance" },
        { src: "golden-homes/Bungalow_Main_Front_Elevation_Day.jpg", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "Row villas for families who want their own ground, their own gate, and their own story.",
      body: "Built for those who choose ground over sky. Golden Homes is a community of independent bungalows — each plot a private world, each street a shared sense of belonging.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-homes/Bungalow_Side_Elevation_Landscaping.jpg", caption: "Private garden & dedicated parking per home" },
        { src: "golden-homes/Community_Park_Area_Amenities.jpg", caption: "Community park & open amenities" },
        { src: "golden-homes/Residential_Layout_Birdview_Aerial.jpg", caption: "G+1 independent plotted bungalows" },
        { src: "golden-homes/Bungalow_Full_Front_View_Day.jpg", caption: "3 BHK with Puja room & garden" },
      ],
    },
    amenities: {
      headline: "Community Amenities",
      body: "Quiet streets, generous green pockets, and space to make your own.",
      feature: { src: "golden-homes/Community_Park_Area_Amenities.jpg" },
      items: AMENITIES_RESIDENTIAL,
    },
    floorPlans: {
      headline: "Floor Plans",
      body: "Boutique Residential Villa Layouts.",
      groups: [
        {
          id: "ground",
          label: "Ground Floor",
          plans: [
            {
              id: "homes-ground",
              label: "3 BHK Villa — Ground",
              metrics: [
                { label: "SBUA", value: "1400 SQ.FT." },
                { label: "TCA", value: "1029 SQ.FT." },
                { label: "Ground Built-up", value: "545 SQ.FT." },
              ],
              features: [
                "Independent Row-Villa lifestyle with dedicated ground-level entry.",
                "Ground floor Bedroom (10x10) plus multi-bedroom setups on 1F.",
                "Front Garden area and dedicated 8'9\" x 18'0\" private parking slot.",
              ],
              image: { src: "golden-homes/ground_floor_unit_plan.png" },
            },
          ],
        },
        {
          id: "first",
          label: "First Floor",
          plans: [
            {
              id: "homes-first",
              label: "3 BHK Villa — First",
              metrics: [
                { label: "First Built-up", value: "484 SQ.FT." },
                { label: "Total Built-up", value: "1029 SQ.FT." },
              ],
              features: [
                "Dedicated First Floor Puja Room for spiritual privacy.",
                "Multi-bedroom configuration with dedicated common toilet.",
              ],
              image: { src: "golden-homes/first_floor_unit_plan.png" },
              note: "*SBUA estimated at ~1.36x Built-up.",
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC load-bearing or framed structure designed for independent units. External plaster with sand finish for durability."],
        ["Architecture", "Modern boutique aesthetic with stone-texture or brick-finish facades. Smooth lime/putty finish for interior surfaces."],
        ["Plumbing & Electrical", "Standard brand plumbing fixtures. Recessed electrical wiring with focus on safety and aesthetic modularity."],
        ["Windows & Doors", "Z-section or aluminium windows for durability. Solid wood or flush doors with standard hardware sets."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at what awaits you.",
      images: [
        { src: "golden-homes/Bungalow_Full_Front_View_Night.jpg" },
        { src: "golden-homes/Bungalow_Internal_Road_Perspective.jpg" },
        { src: "golden-homes/Bungalow_Side_Elevation_Landscaping.jpg" },
        { src: "golden-homes/Bungalow_Entrance_Parking_View.jpg" },
        { src: "golden-homes/Community_Park_Area_Amenities.jpg" },
        { src: "golden-homes/Residential_Layout_Birdview_Aerial.jpg" },
      ],
    },
    masterPlan: {
      headline: "Master Plan",
      body: "Plotted layout of the bungalow community.",
      image: { src: "golden-homes/master_layout_plan.png" },
    },
    location: {
      headline: "Location",
      body: "Located in Ankleshwar, close to schools and arterial roads.",
      map: { src: "" },
      address: "Ankleshwar, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-homes/Bungalow_Full_Front_View_Night.jpg" },
    },
  },
};

const goldenPalmVilla: Project = {
  id: "golden-palm-villa",
  slug: "golden-palm-villa",
  name: "Golden Palm Villa",
  type: "residential",
  category: "3 BHK Bungalows",
  location: "Ankleshwar",
  area: "Plot-based",
  status: "Completed",
  images: [
    { src: "golden-palm-villa/Bungalow_Street_Level_Day_View.jpg" },
    { src: "golden-palm-villa/Bungalow_Main_Front_Elevation_Night.jpg" },
    { src: "golden-palm-villa/Community_Park_And_Landscaping_Aerial.jpg" },
    { src: "golden-palm-villa/Landscape_Garden_Gazebo_and_Waterpond.jpg" },
  ],
  detail: {
    hero: {
      image: { src: "golden-palm-villa/Bungalow_Main_Front_Elevation_Night.jpg" },
      eyebrow: "Bungalow Community",
      tagline: "Seventy-four families. One exceptional address.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-palm-villa/Bungalow_Street_Level_Day_View.jpg", caption: "Main Entrance Approach" },
        { src: "golden-palm-villa/Bungalow_Main_Front_Elevation_Night.jpg", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "A private bungalow community where space, greenery and good neighbours come as standard.",
      body: "Open land. Private life. Golden Palm Villa offers families the rare combination of bungalow ownership, curated landscaping, and a clubhouse community — where your home has room to breathe.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-palm-villa/Community_Park_And_Landscaping_Aerial.jpg", caption: "74 private bungalow homes" },
        { src: "golden-palm-villa/Landscape_Garden_Gazebo_and_Waterpond.jpg", caption: "Garden gazebo & water pond" },
        { src: "golden-palm-villa/Bungalow_Street_Level_Day_View.jpg", caption: "3 BHK with individual plot & garden" },
        { src: "golden-palm-villa/Bungalow_Street_Landscape_Night_Perspective.jpg", caption: "Club house & premium amenities" },
      ],
    },
    amenities: {
      headline: "Community Amenities",
      body: "Curated grounds, a clubhouse, and quiet streets to call your own.",
      feature: { src: "golden-palm-villa/Landscape_Garden_Gazebo_and_Waterpond.jpg" },
      items: [
        { key: "clubhouse", label: "Club House" },
        { key: "garden", label: "Landscaped Garden" },
        { key: "play-area", label: "Children's Play Area" },
        { key: "walking-track", label: "Walking Track" },
        { key: "security", label: "24x7 Security" },
        { key: "parking", label: "Private Parking" },
      ],
    },
    floorPlans: {
      headline: "Floor Plans",
      body: "Private Bungalow Community Layouts.",
      groups: [
        {
          id: "3bhk",
          label: "3 BHK Bungalow",
          plans: [
            {
              id: "palm-villa-3bhk",
              label: "3 BHK Bungalow",
              metrics: [{ label: "Configuration", value: "3 BHK" }],
              features: [
                "Luxury living with natural beauty across 74 private family homes.",
                "State-of-the-art amenities including a dedicated club house.",
                "Generously sized 3 BHK layout with open garden space per unit.",
                "Specifically curated brands for all infrastructure and finishes.",
              ],
              image: { src: "" },
              note: "Detailed plan drawings available on request.",
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC frame structure."],
        ["Architecture", "24x24 vitrified tiles with skirting. Decorative main door with sal wood and inner door frames in flush door. Powder-coated aluminium section windows with marble seal. Marble stairs with decorative CRC pipe railing."],
        ["Plumbing & Services", "Black granite platform with stainless steel sink and full-height decorative glaze tiles. Concealed ISI, CPVC & UPVC plumbing with bathroom fittings. PVC water tank for individual bungalows."],
        ["Electrical", "ISI standard concealed electric wiring with modular boards."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at what awaits you.",
      images: [
        { src: "golden-palm-villa/Community_Park_And_Landscaping_Aerial.jpg" },
        { src: "golden-palm-villa/Landscape_Garden_Gazebo_and_Waterpond.jpg" },
        { src: "golden-palm-villa/Bungalow_Street_Landscape_Night_Perspective.jpg" },
        { src: "golden-palm-villa/Bungalow_Street_Level_Day_View.jpg" },
      ],
    },
    location: {
      headline: "Location",
      body: "Set in Ankleshwar with the conveniences of city access.",
      map: { src: "" },
      address: "Ankleshwar, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-palm-villa/Bungalow_Main_Front_Elevation_Night.jpg" },
    },
  },
};

const goldenResidency: Project = {
  id: "golden-residency",
  slug: "golden-residency",
  name: "Golden Residency",
  type: "residential",
  category: "1 & 2 BHK Flats",
  location: "Bharuch",
  area: "1000 Sq. Ft. (SBUA)",
  status: "Completed",
  images: [
    { src: "golden-residency/Building_Side_Elevation_Daylight.jpg" },
    { src: "golden-residency/Building_Full_Front_Elevation_Day.jpg" },
    { src: "golden-residency/Residential_Complex_Birdview_Aerial.jpg" },
  ],
  detail: {
    hero: {
      image: { src: "golden-residency/Building_Full_Front_Elevation_Day.jpg" },
      eyebrow: "Urban Apartments",
      tagline: "A well-designed home at a price that makes sense.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-residency/Building_Side_Elevation_Daylight.jpg", caption: "Main Entrance Approach" },
        { src: "golden-residency/Building_Full_Front_Elevation_Day.jpg", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "Straightforward, solid, and built for families that value quality in every square foot.",
      body: "A home that earns its place in your life. Golden Residency is built on the belief that great homes shouldn't ask you to compromise — clean layouts, solid construction, and a well-connected address for families investing in today.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-residency/Residential_Complex_Birdview_Aerial.jpg", caption: "Multi-block gated complex" },
        { src: "golden-residency/Project_1BHK_Typical_Floor_Plan.png", caption: "1 BHK & 2 BHK layouts" },
        { src: "golden-residency/typical_floor_plan_2bhk_wing_a,b,c,d,g-h.png", caption: "2 BHK across Wings A–H" },
        { src: "golden-residency/basement_parking_plan.png", caption: "Covered basement parking" },
      ],
    },
    amenities: {
      headline: "Everyday Amenities",
      body: "All the essentials for value-led modern living.",
      feature: { src: "golden-residency/Building_Side_Elevation_Daylight.jpg" },
      items: AMENITIES_RESIDENTIAL,
    },
    floorPlans: {
      headline: "Floor Plans",
      body: "Urban Residential Apartment Layouts.",
      groups: [
        {
          id: "2bhk",
          label: "2 BHK (Wings A, B, C, D, G, H)",
          plans: [
            {
              id: "2bhk-typical",
              label: "2 BHK",
              metrics: [
                { label: "SBUA", value: "1000 SQ.FT." },
                { label: "TCA", value: "732 SQ.FT." },
                { label: "Carpet (C.A.)", value: "702.50 SQ.FT." },
              ],
              features: [
                "Optimized 2 BHK footprint for efficient modern urban family living.",
                "Standardized layouts across Blocks A, B, C, D, E, and F.",
                "Integrated balcony area for natural light and cross-ventilation.",
                "Compact yet functional kitchen with attached utility/wash space.",
              ],
              image: { src: "golden-residency/typical_floor_plan_2bhk_wing_a,b,c,d,g-h.png" },
              note: "*SBUA estimated at ~1.37x Carpet.",
            },
          ],
        },
        {
          id: "1bhk",
          label: "1 BHK (Wings E, F)",
          plans: [
            {
              id: "1bhk-typical",
              label: "1 BHK",
              metrics: [{ label: "Type", value: "Compact 1 BHK" }],
              features: [
                "Compact 1 BHK plan tuned for value-conscious buyers.",
                "Cross-ventilated layout with attached toilet and balcony.",
              ],
              image: { src: "golden-residency/typical_floor_plan_wing_f,e_1bhk.png" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC framed earthquake-resistant structure. Quality masonry work for internal and external walls for better insulation."],
        ["Architecture", "Modern elevation with weather-shield exterior paint. Vitrified flooring in all rooms and anti-skid tiles in toilets and wash areas."],
        ["Plumbing & Electrical", "Concealed copper wiring with branded switches. Standard CP fittings and sanitaryware in all bathrooms."],
        ["Windows & Doors", "Aluminium sliding windows and wooden door frames. Flush doors with standard hardware and decorative main entrance."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at what awaits you.",
      images: [
        { src: "golden-residency/Building_Full_Front_Elevation_Day.jpg" },
        { src: "golden-residency/Building_Side_Elevation_Daylight.jpg" },
        { src: "golden-residency/Residential_Complex_Birdview_Aerial.jpg" },
      ],
    },
    masterPlan: {
      headline: "Master Plan",
      body: "Ground layout and block placement.",
      image: { src: "golden-residency/ground_layout_plan.png" },
    },
    location: {
      headline: "Location",
      body: "Located in Bharuch with quick access to schools and the city centre.",
      map: { src: "" },
      address: "Bharuch, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-residency/Residential_Complex_Birdview_Aerial.jpg" },
    },
  },
};

const goldenPalmPlaza: Project = {
  id: "golden-palm-plaza",
  slug: "golden-palm-plaza",
  name: "Golden Palm Plaza",
  type: "commercial-industrial",
  category: "Shops & Offices",
  location: "Ankleshwar",
  area: "100 units across 5 floors",
  status: "Completed",
  images: [
    { src: "golden-palm-plaza/Commercial_Plaza_Gate_Side_Night_Perspective (1) 1.png" },
    { src: "golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day 1.png" },
    { src: "/commercial-hero.png" },
    { src: "/commercial-hero.png" },
  ],
  detail: {
    hero: {
      image: { src: "golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day 1.png" },
      eyebrow: "Retail & Office",
      tagline: "Premium retail and office spaces in the heart of Ankleshwar.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-palm-plaza/Commercial_Plaza_Gate_Side_Night_Perspective (1) 1.png", caption: "Entrance Gate (Night)" },
        { src: "golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day 1.png", caption: "Front Elevation (Day)" },
      ],
    },
    intro: {
      headline: "Designed to give your business the wings it deserves with maximum visibility.",
      body: "Maximum Light. Maximum Impact. Located in the heart of Ankleshwar, Golden Palm Plaza offers 100 Shops and Offices across 5 floors. The building is designed specifically to ensure every unit gets noticed.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day 1.png", caption: "High-visibility Retail Hub" },
        { src: "golden-palm-plaza/Commercial_Plaza_Gate_Side_Night_Perspective (1) 1.png", caption: "Premium Night Visibility" },
        { src: "/commercial-hero.png", caption: "Boutique Office Spaces" },
        { src: "/commercial-hero.png", caption: "Wide Basement Parking" },
      ],
    },
    amenities: {
      headline: "Building Amenities",
      feature: { src: "golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day 1.png" },
      items: AMENITIES_COMMERCIAL,
    },
    floorPlans: {
      headline: "Project Layouts",
      body: "Retail & Office Floor Plans.",
      groups: [
        {
          id: "retail",
          label: "Shops (Ground & 1st)",
          plans: [
            {
              id: "retail-plan",
              label: "Retail Units",
              metrics: [{ label: "Total Shops", value: "~50" }],
              features: [
                "Strategic location ensures no shop or office goes unnoticed.",
                "Perfect for showrooms, banks, corporate offices, and supermarkets.",
                "Wide parking space for visitors and stakeholders.",
              ],
              image: { src: "" },
            },
          ],
        },
        {
          id: "office",
          label: "Offices (2nd – 4th)",
          plans: [
            {
              id: "office-plan",
              label: "Office Units",
              metrics: [{ label: "Total Offices", value: "~50" }],
              features: [
                "Modern elevation with focus on natural light.",
                "High-speed elevator core and double-loaded corridors.",
              ],
              image: { src: "" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC frame structure with high load-bearing capacity."],
        ["Finishes", "Granamite tile flooring and smooth interior finishes."],
        ["Connectivity", "High-speed lifts with concealed electrical and PVC fittings."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at the plaza.",
      images: [
        { src: "golden-palm-plaza/Commercial_Plaza_Gate_Side_Night_Perspective (1) 1.png" },
        { src: "golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day 1.png" },
      ],
    },
    location: {
      headline: "Location",
      body: "Anchored in the commercial hub of Ankleshwar.",
      map: { src: "" },
      address: "Ankleshwar, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day 1.png" },
    },
  },
};

const goldenSquareAnk: Project = {
  id: "golden-square",
  slug: "golden-square",
  name: "Golden Square — Ankleshwar",
  type: "commercial-industrial",
  category: "Commercial Shops & Offices",
  location: "Ankleshwar",
  area: "Multi-level commercial",
  status: "Completed",
  images: [
    { src: "golden-square/Building_Main_Front_Elevation_Day.png" },
    { src: "golden-square/Building_Front_Elevation_Parking_View.png" },
    { src: "golden-square/Interior_Atrium_Mall_View.png" },
    { src: "golden-square/Interior_Mall_Retail_Floor.png" },
  ],
  detail: {
    hero: {
      image: { src: "golden-square/Building_Main_Front_Elevation_Day.png" },
      eyebrow: "Commercial Centre",
      tagline: "Boost your business with a state-of-the-art address.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-square/Building_Main_Front_Elevation_Day.png", caption: "Front Elevation" },
        { src: "golden-square/Building_Front_Elevation_Parking_View.png", caption: "Parking & Frontage" },
      ],
    },
    intro: {
      headline: "Situated in the heart of the city for maximum business visibility.",
      body: "The Heart of Business. Boost your business with Golden Group's state-of-the-art commercial project. Situated in the heart of Ankleshwar, offering modern elevation and efficient retail and office spaces.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-square/Building_Street_Perspective_View.png", caption: "Premium Retail Frontage" },
        { src: "golden-square/Interior_Courtyard_Seating_Area.png", caption: "Modern Commercial Elevation" },
        { src: "golden-square/Interior_Mall_Retail_Floor.png", caption: "Retail Floor Concourse" },
        { src: "golden-square/Interior_Office_Block_Atrium.png", caption: "Office Block Atrium" },
      ],
    },
    amenities: {
      headline: "Building Amenities",
      feature: { src: "golden-square/Interior_Atrium_Mall_View.png" },
      items: AMENITIES_COMMERCIAL,
    },
    floorPlans: {
      headline: "Project Layouts",
      body: "Retail & Office Floor Plans.",
      groups: [
        {
          id: "retail",
          label: "Shops (Ground)",
          plans: [
            {
              id: "retail-plan",
              label: "Commercial Shops",
              metrics: [{ label: "Status", value: "Available" }],
              features: [
                "Prime location in the commercial hub of Ankleshwar.",
                "Designed for banks, retail showrooms, and medical suites.",
              ],
              image: { src: "" },
            },
          ],
        },
        {
          id: "office",
          label: "Offices (Upper Floors)",
          plans: [
            {
              id: "office-plan",
              label: "Luxury Offices",
              metrics: [{ label: "Status", value: "Available" }],
              features: [
                "Modern glass-fronted elevation for a premium corporate look.",
                "24/7 security with CCTV and fire safety systems.",
              ],
              image: { src: "" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "RCC earthquake-resistant design with massive frontage."],
        ["Architecture", "Modern facade with premium vitrified tiles and smooth plaster finishes."],
        ["Amenities", "Wide internal corridors, passenger lifts, and ample parking on all sides."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at the building.",
      images: [
        { src: "golden-square/Building_Main_Front_Elevation_Day.png" },
        { src: "golden-square/Building_Front_Elevation_Parking_View.png" },
        { src: "golden-square/Building_Street_Perspective_View.png" },
        { src: "golden-square/Interior_Atrium_Mall_View.png" },
        { src: "golden-square/Interior_Courtyard_Seating_Area.png" },
        { src: "golden-square/Interior_Mall_Retail_Floor.png" },
        { src: "golden-square/Interior_Office_Block_Atrium.png" },
      ],
    },
    location: {
      headline: "Location",
      body: "Anchored in the commercial heart of Ankleshwar.",
      map: { src: "" },
      address: "Ankleshwar, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-square/Building_Main_Front_Elevation_Day.png" },
    },
  },
};

const goldenSquareBharuch: Project = {
  id: "golden-square-bharuch",
  slug: "golden-square-bharuch",
  name: "Golden Square — Bharuch",
  type: "commercial-industrial",
  category: "150 Shops & 102 Offices",
  location: "Bharuch",
  area: "Multi-level commercial",
  status: "Completed",
  images: [
    { src: "golden-square-bharuch/Building_Front_Daylight_Full_Elevation.jpg" },
    { src: "golden-square-bharuch/Entrance_Parking_Ramp_Close_up.jpg" },
    { src: "golden-square-bharuch/Interior_Atrium_Mall_View.jpg" },
    { src: "golden-square-bharuch/Cinemas entry-01.jpg" },
  ],
  detail: {
    hero: {
      image: { src: "golden-square-bharuch/Building_Front_Daylight_Full_Elevation.jpg" },
      eyebrow: "Mixed-use Commercial",
      tagline: "The new standard for business in the port city.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "golden-square-bharuch/Entrance_Parking_Ramp_Close_up.jpg", caption: "Main Entrance & Ramp" },
        { src: "golden-square-bharuch/Building_Front_Daylight_Full_Elevation.jpg", caption: "Front Elevation" },
      ],
    },
    intro: {
      headline: "Most stylish commercial project designed for those who won't settle for less than the best.",
      body: "Where business meets luxury. Designed by India's famous architect Sanjay Joshi, Golden Square Bharuch is a landmark structure offering massive 102 Offices and 150 Shops with world-class facilities.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "golden-square-bharuch/Interior_Atrium_Mall_View.jpg", caption: "Grand Interior Atrium" },
        { src: "golden-square-bharuch/Cinemas entry-01.jpg", caption: "Luxury Cinema Entry" },
        { src: "golden-square-bharuch/Food court-04.jpg", caption: "Premium Food Court Area" },
        { src: "golden-square-bharuch/Exterior_Walkway_Ivy_Lights.jpg", caption: "Landscaped Walkways" },
      ],
    },
    amenities: {
      headline: "Building Amenities",
      body: "From triple-height atrium to dedicated cinema and food court — designed for footfall.",
      feature: { src: "golden-square-bharuch/Interior_Atrium_Mall_View.jpg" },
      items: AMENITIES_COMMERCIAL,
    },
    floorPlans: {
      headline: "Project Layouts",
      body: "Retail & Office Floor Plans.",
      groups: [
        {
          id: "ground",
          label: "Ground Floor",
          plans: [
            {
              id: "ground-plan",
              label: "Ground Retail",
              metrics: [{ label: "Total Shops", value: "150" }],
              features: [
                "State-of-the-art structure with triple-height atrium.",
                "Dedicated floors for retail, food court, and multiplex.",
              ],
              image: { src: "golden-square-bharuch/ground_floor_plan.png" },
            },
          ],
        },
        {
          id: "first",
          label: "First Floor",
          plans: [
            {
              id: "first-plan",
              label: "First Floor Retail",
              metrics: [{ label: "Status", value: "Available" }],
              features: [
                "High-speed elevators and wide corridors for smooth traffic flow.",
              ],
              image: { src: "golden-square-bharuch/first_floor_plan.png" },
            },
          ],
        },
        {
          id: "office",
          label: "Offices (4th – 9th)",
          plans: [
            {
              id: "office-plan",
              label: "Office Floors",
              metrics: [{ label: "Total Offices", value: "102" }],
              features: [
                "Premium location with massive visibility and frontage.",
                "Modular floor plates suit corporate and boutique tenants.",
              ],
              image: { src: "golden-square-bharuch/4th_to_9th_floor_plan.png" },
            },
          ],
        },
        {
          id: "basement",
          label: "Basement Parking",
          plans: [
            {
              id: "basement-plan",
              label: "Basement Parking",
              metrics: [{ label: "Type", value: "Multi-level" }],
              features: [
                "Wide visitor and tenant parking provisions.",
              ],
              image: { src: "golden-square-bharuch/basement_parking_layout.png" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Structure", "Earthquake-resistant RCC frame structure with modern architectural facade."],
        ["Architecture", "Designer atrium with skylight, premium vitrified tiles in all common areas, and high-quality exterior finish."],
        ["Utilities", "Dedicated fire-fighting system, high-capacity generator backup for common areas, and 24/7 security surveillance."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at the building.",
      images: [
        { src: "golden-square-bharuch/Building_Street_Perspective_View.jpg" },
        { src: "golden-square-bharuch/Entrance Foyer-Final.jpg" },
        { src: "golden-square-bharuch/Theater lobby-06.jpg" },
        { src: "golden-square-bharuch/Passage.jpg" },
        { src: "golden-square-bharuch/new Cam_09.jpg" },
        { src: "golden-square-bharuch/Food court-04.jpg" },
        { src: "golden-square-bharuch/Cinemas entry-01.jpg" },
        { src: "golden-square-bharuch/Exterior_Walkway_Ivy_Lights.jpg" },
      ],
    },
    location: {
      headline: "Location",
      body: "Anchored in the commercial centre of Bharuch.",
      map: { src: "" },
      address: "Bharuch, Gujarat",
      pins: LOCATION_PINS_DEFAULT,
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "golden-square-bharuch/Building_Front_Daylight_Full_Elevation.jpg" },
    },
  },
};

const goldenIndustrialEstate: Project = {
  id: "golden-industrial-estate",
  slug: "golden-industrial-estate",
  name: "Golden Industrial Estate",
  type: "commercial-industrial",
  category: "Industrial Plots",
  location: "Surat",
  area: "468 plots (17x100 / 17x120 ft)",
  status: "Completed",
  images: [
    { src: "/commercial-hero.png" },
    { src: "/commercial-hero.png" },
    { src: "/commercial-hero.png" },
    { src: "/commercial-hero.png" },
  ],
  detail: {
    hero: {
      image: { src: "/commercial-hero.png" },
      eyebrow: "Industrial Estate",
      tagline: "The strategic gateway for Surat's industrial growth.",
    },
    firstLook: {
      headline: "First Look",
      items: [
        { src: "/commercial-hero.png", caption: "Estate Entry" },
        { src: "/commercial-hero.png", caption: "Master Layout" },
      ],
    },
    intro: {
      headline: "Massive scale, perfect connectivity, and all-inclusive infrastructure.",
      body: "Industrial Excellence at Delad. Spanning across a strategic location connected to NH 48, this estate provides 468 plots designed for efficiency and growth. With full infrastructure from gas lines to RCC roads.",
    },
    highlights: {
      headline: "Visual Highlights",
      items: [
        { src: "/commercial-hero.png", caption: "468 Premium Industrial Plots" },
        { src: "/commercial-hero.png", caption: "Wide RCC Roads & Street Lights" },
        { src: "/commercial-hero.png", caption: "Dedicated Gas & Drainage Lines" },
        { src: "/commercial-hero.png", caption: "4 Large Garden Areas" },
      ],
    },
    amenities: {
      headline: "Estate Amenities",
      feature: { src: "/commercial-hero.png" },
      items: [
        { key: "parking", label: "Heavy Vehicle Movement" },
        { key: "security", label: "Compound Security" },
        { key: "garden", label: "4 Garden Areas" },
        { key: "solar-power", label: "Power & Gas Lines" },
      ],
    },
    floorPlans: {
      headline: "Estate Layout",
      body: "Industrial Plot Plan.",
      groups: [
        {
          id: "plots",
          label: "Industrial Plots",
          plans: [
            {
              id: "plots-plan",
              label: "17x100 / 17x120 ft",
              metrics: [
                { label: "Total Plots", value: "468" },
                { label: "Sizes", value: "17x100 / 17x120 ft" },
              ],
              features: [
                "Connected by main road leading directly to National Highway 48.",
                "N.A. passing completed with all legal approvals.",
                "Full utility support: electricity point, gas line, and drainage.",
                "Attractive entry gate with compound wall for security.",
              ],
              image: { src: "" },
            },
          ],
        },
      ],
    },
    specifications: {
      headline: "Specifications",
      items: specs(
        ["Roads & Infra", "Heavy-duty RCC roads designed for industrial transport."],
        ["Utilities", "Individual electricity and gas connection points provided for each plot."],
        ["Amenities", "4 wide garden areas for workers' leisure and environmental balance."],
      ),
    },
    gallery: {
      headline: "Gallery",
      body: "A look at the estate.",
      images: [{ src: "/commercial-hero.png" }],
    },
    location: {
      headline: "Location",
      body: "Connected directly to National Highway 48 in Delad, Surat.",
      map: { src: "" },
      address: "Delad, Surat",
      pins: [
        { label: "NH 48", minutes: 2, category: "Transit" },
        { label: "Surat City", minutes: 35, category: "Transit" },
        { label: "Hazira Port", minutes: 50, category: "Transit" },
      ],
    },
    pillars: { items: PILLARS_DEFAULT },
    walkthrough: {
      headline: "Walkthrough",
      image: { src: "/commercial-hero.png" },
    },
  },
};

export const PROJECTS: Project[] = [
  goldenLuxuria,
  goldenHeaven,
  goldenNirvana,
  goldenVilla,
  goldenHomes,
  goldenPalmVilla,
  goldenResidency,
  goldenPalmPlaza,
  goldenSquareBharuch,
  goldenSquareAnk,
  goldenIndustrialEstate,
];

export function listProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export type SectionKey =
  | "overview"
  | "highlights"
  | "amenities"
  | "master-plan"
  | "floor-plans"
  | "gallery"
  | "walkthrough"
  | "specifications"
  | "location";

export type SectionItem = { key: SectionKey; label: string };

export function getProjectSections(project: Project): SectionItem[] {
  const d = project.detail;
  if (!d) return [];

  const sections: SectionItem[] = [{ key: "overview", label: "Overview" }];

  if (d.highlights && d.highlights.items.length > 0) {
    sections.push({ key: "highlights", label: "Highlights" });
  }
  if (d.amenities.items.length > 0) {
    sections.push({ key: "amenities", label: "Amenities" });
  }
  if (d.masterPlan && d.masterPlan.image.src) {
    sections.push({ key: "master-plan", label: "Master Plan" });
  }
  if (d.floorPlans.groups.length > 0) {
    sections.push({ key: "floor-plans", label: "Floor Plans" });
  }
  if (d.gallery.images.length > 0) {
    sections.push({ key: "gallery", label: "Gallery" });
  }
  if (d.walkthrough.image.src || d.walkthrough.videoUrl) {
    sections.push({ key: "walkthrough", label: "Walkthrough" });
  }
  if (d.specifications.items.length > 0) {
    sections.push({ key: "specifications", label: "Specifications" });
  }
  if (d.location.body || d.location.address || d.location.pins.length > 0 || d.location.map.src) {
    sections.push({ key: "location", label: "Location" });
  }

  return sections;
}
