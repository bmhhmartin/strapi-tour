import type { Page } from "@/types/strapi";
import type { StrapiMedia } from "@/types/strapi";

function photo(
  id: number,
  unsplashId: string,
  alt: string,
  width = 1600,
  height = 1067,
): StrapiMedia {
  return {
    id,
    documentId: `media-${id}`,
    url: `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=${width}&q=80`,
    alternativeText: alt,
    width,
    height,
    mime: "image/jpeg",
  };
}

export const fixturePages: Page[] = [
  {
    id: 1,
    documentId: "page-home",
    title: "Meridian Trails",
    slug: "home",
    seo: {
      metaTitle: "Meridian Trails — Journeys with a slower pulse",
      metaDescription:
        "Small-group travel for people who want landscapes, meals, and conversations that linger. Explore our services, vision, and upcoming tours.",
      shareImage: photo(
        10,
        "photo-1469474968028-56623f02e42e",
        "Sunlit mountain valley",
      ),
    },
    blocks: [
      {
        __component: "shared.hero-banner",
        id: 1,
        title: "The world, unhurried",
        subtitle:
          "Small-group journeys for people who travel to listen, not to tick boxes.",
        ctaLabel: "Browse tours",
        ctaHref: "#tours",
        background: photo(
          11,
          "photo-1469474968028-56623f02e42e",
          "Sun breaking over a mountain valley",
          2400,
          1600,
        ),
      },
      {
        __component: "shared.services",
        id: 2,
        heading: "How we travel with you",
        intro:
          "Every itinerary is built around walking, eating, and staying somewhere you would actually want to return to.",
        items: [
          {
            id: 21,
            title: "Guided walks",
            body: "Local walkers, not megaphones. Dawn ridgelines, market alleys, and the long way around.",
            icon: "compass",
          },
          {
            id: 22,
            title: "Local stays",
            body: "Family inns, restored townhouses, and lodges that belong to the landscape.",
            icon: "home",
          },
          {
            id: 23,
            title: "Quiet logistics",
            body: "Permits, transfers, and pacing handled so you can keep your phone in your pocket.",
            icon: "map",
          },
        ],
      },
      {
        __component: "shared.vision-mission",
        id: 3,
        heading: "Why Meridian exists",
        visionTitle: "Vision",
        visionBody:
          "A way of travelling that leaves places more intact than we found them — and travellers more awake than when they left home.",
        missionTitle: "Mission",
        missionBody:
          "We craft small-group journeys with people who live where we go: cooks, naturalists, and hosts who set the rhythm of each day.",
        image: photo(
          12,
          "photo-1501785888041-af3ef285b470",
          "Lake and mountain range at dusk",
        ),
      },
      {
        __component: "shared.tour-list",
        id: 4,
        heading: "Upcoming journeys",
        tours: [
          {
            id: 41,
            title: "Temples, terraces, slow Bali",
            location: "Bali, Indonesia",
            duration: "8 days",
            price: "from $2,480",
            excerpt:
              "Ubud mornings, Sidemen rice paths, and a coastline that still feels like an island.",
            href: "/destinations/bali",
            image: photo(
              13,
              "photo-1537996194471-e657df975ab4",
              "Temple spires against a Bali sky",
            ),
          },
          {
            id: 42,
            title: "Kyoto in the quiet season",
            location: "Kyoto, Japan",
            duration: "7 days",
            price: "from $3,120",
            excerpt:
              "Temple gardens after the crowds, kaiseki at a counter, and walks along the Kamo.",
            href: "/destinations/bali",
            image: photo(
              14,
              "photo-1493976040371-404b5c2e4c0e",
              "Traditional Japanese street in autumn",
            ),
          },
          {
            id: 43,
            title: "Patagonia on foot",
            location: "Torres del Paine, Chile",
            duration: "10 days",
            price: "from $4,050",
            excerpt:
              "Wind, granite, and refugios. A walking trip for people who like weather with a personality.",
            href: "/destinations/bali",
            image: photo(
              15,
              "photo-1464822759023-fed622ff2c3b",
              "Snowcapped mountain peak",
            ),
          },
        ],
      },
      {
        __component: "shared.testimonials",
        id: 5,
        heading: "Letters from the road",
        quotes: [
          {
            id: 51,
            body: "It felt less like a tour and more like being lent a set of keys to someone else's town.",
            attribution: "Amelia K.",
            role: "Bali, 2025",
          },
          {
            id: 52,
            body: "The walking days were long. The dinners were longer. I still think about the soup.",
            attribution: "Jonas R.",
            role: "Kyoto, 2025",
          },
          {
            id: 53,
            body: "Nobody hurried us to the next viewpoint. That, it turns out, is the whole point.",
            attribution: "Priya S.",
            role: "Patagonia, 2024",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    documentId: "page-bali",
    title: "Bali",
    slug: "destinations/bali",
    seo: {
      metaTitle: "Bali — Temples, terraces, slow days | Meridian Trails",
      metaDescription:
        "An eight-day walking journey through Ubud, Sidemen, and the east coast — small group, local hosts, no rush.",
      shareImage: photo(
        20,
        "photo-1537996194471-e657df975ab4",
        "Balinese temple",
      ),
    },
    blocks: [
      {
        __component: "shared.hero-banner",
        id: 6,
        title: "Bali, at walking pace",
        subtitle:
          "Eight days through temple courtyards, ridgeline rice, and a coastline that still belongs to the morning.",
        ctaLabel: "See the itinerary",
        ctaHref: "#tours",
        background: photo(
          21,
          "photo-1518548419970-58e3b4079ab2",
          "Tropical coastline in Bali",
          2400,
          1600,
        ),
      },
      {
        __component: "shared.tour-list",
        id: 7,
        heading: "Days on the island",
        tours: [
          {
            id: 71,
            title: "Ubud & the ridge",
            location: "Ubud",
            duration: "Days 1–3",
            price: null,
            excerpt:
              "Campuhan ridge at first light, a cooking afternoon, and a night market without a checklist.",
            href: "#tours",
            image: photo(
              22,
              "photo-1555400038-63f5ba517a47",
              "Rice terraces in Bali",
            ),
          },
          {
            id: 72,
            title: "Sidemen valley",
            location: "Sidemen",
            duration: "Days 4–6",
            price: null,
            excerpt:
              "A quieter valley, weaving workshops, and a river lunch that tends to run late.",
            href: "#tours",
            image: photo(
              23,
              "photo-1573790387438-4da905039392",
              "Lush Balinese hillside",
            ),
          },
          {
            id: 73,
            title: "East coast light",
            location: "Amed",
            duration: "Days 7–8",
            price: null,
            excerpt:
              "Black-sand mornings, jukung boats, and a last dinner under a tin roof.",
            href: "#tours",
            image: photo(
              24,
              "photo-1539367628448-4bc5c9d171c8",
              "Boat on clear tropical water",
            ),
          },
        ],
      },
      {
        __component: "shared.testimonials",
        id: 8,
        heading: "From guests who walked it",
        quotes: [
          {
            id: 81,
            body: "Sidemen is the Bali I had been hoping still existed. We had time to notice the light change.",
            attribution: "Elena M.",
            role: "Guest, 2025",
          },
          {
            id: 82,
            body: "Our host in Ubud treated us like cousins who had finally shown up. That set the whole week.",
            attribution: "David L.",
            role: "Guest, 2025",
          },
        ],
      },
    ],
  },
];
