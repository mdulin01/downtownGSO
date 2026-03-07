// Run this from Cloud Shell: node seed-news.js
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const articles = [
  {
    title: "2026 State of Downtown Highlights Growth and Vision for Greensboro",
    summary: "Downtown Greensboro Inc. presented its annual State of Downtown report, outlining progress under the GSO 35 plan. The 10-year vision aims to add 5,000 new residents, 3,000 jobs, and more than 100 new or expanded ground-floor businesses to the downtown core.",
    category: "Development",
    source: "FOX8 WGHP",
    sourceUrl: "https://myfox8.com/news/north-carolina/greensboro/2026-state-of-downtown-highlights-growth-vision-for-greensboro/",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&fit=crop",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date("2026-02-25"))
  },
  {
    title: "Former News & Record Property Acquired for City Center Redevelopment",
    summary: "The 6.65-acre parcel in downtown Greensboro, formerly home to the News & Record, has been purchased by Center City Investors, LLC. The partnership, created by the Community Foundation of Greater Greensboro, plans to develop approximately 300 apartments to expand the east side of downtown.",
    category: "Development",
    source: "WFMY News 2",
    sourceUrl: "https://www.wfmynews2.com/article/news/local/former-news-record-property-acquired-for-greensboro-city-center-redevelopment/83-e27b6052-f5cc-4394-aef1-75e8ea042785",
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&fit=crop",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date("2026-02-18"))
  },
  {
    title: "Carroll at Parkside: New Mixed-Use Development Coming Downtown",
    summary: "A major mixed-use development is planned for downtown Greensboro featuring a modern 161-room, 8-story AC Hotel with rooftop bar and pool, alongside 348 luxury apartment homes. The Carroll at Parkside project promises to reshape the downtown skyline.",
    category: "Development",
    source: "The Carroll Companies",
    sourceUrl: "https://thecarrollcompanies.com/project/coming-to-greensboro/",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&fit=crop",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date("2026-02-10"))
  },
  {
    title: "Downtown Leaders Address Business Closures, Seek Solutions",
    summary: "Several well-known businesses in and around downtown Greensboro have recently closed, sparking concern among city leaders and business owners. Community leaders are working on strategies to support existing businesses and attract new ones to fill vacant storefronts.",
    category: "Business",
    source: "Spectrum News",
    sourceUrl: "https://spectrumlocalnews.com/nc/charlotte/news/2026/02/11/downtown-greensboro-leaders-seek-solutions-after-multiple-business-closures",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80&fit=crop",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date("2026-02-11"))
  },
  {
    title: "New 7-Story Apartment Complex Planned at Former Davie Street Parking Deck",
    summary: "Plans have been revealed for a 7-story, 171-unit apartment complex at the site of the former Davie Street parking deck. The development will feature a third-floor pool and ground-level retail and restaurant space, adding significant new housing to the downtown core.",
    category: "Housing",
    source: "WFMY News 2",
    sourceUrl: "https://www.wfmynews2.com/article/news/local/state-of-downtown-dgi-details-parking-residential-future-for-greensboro/83-c01c4646-5f8e-4379-acc9-ad227d8021d9",
    imageUrl: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80&fit=crop",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date("2026-02-20"))
  }
];

async function seed() {
  for (const article of articles) {
    const ref = await db.collection("news").add(article);
    console.log("Added: " + article.title + " -> " + ref.id);
  }
  console.log("Done! Added " + articles.length + " articles.");
}

seed();
