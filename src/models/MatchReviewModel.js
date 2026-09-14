/**
 * Model: MatchReviewModel
 * Represents algorithmic correlation pipeline data for candidate pairings
 * mapped to database `matches`, `reports`, and `users` tables.
 */
export class MatchReviewModel {
  static getCandidates() {
    return [
      {
        id: 'M-4091',
        tag: 'High Confidence',
        tagType: 'amber',
        timeAgo: 'Just now',
        confidenceScore: 94,
        category: 'Electronics / Mobile Phones',
        lostReport: {
          id: 'L-2049',
          title: 'iPhone 15 Pro Max',
          category: 'Electronics / Mobile Phones',
          colorFinish: 'Titanium Blue with matte finish',
          location: 'Gate 4, International Departures',
          dateTime: 'Oct 23, 2024 • 14:15 WIB',
          distinguishingMarkings: 'Small scratch near charging port, lockscreen has golden retriever wallpaper',
          contactName: 'Alexander Wright',
          contactEmail: 'alex.w@gmail.com',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Reported Photo'
        },
        foundReport: {
          id: 'F-3182',
          title: 'Dark Metallic Blue iPhone',
          category: 'Electronics / Mobile Phones',
          colorFinish: 'Navy / Titanium Blue',
          location: 'Terminal 3 Gate 4 waiting lounge, seat 12B',
          dateTime: 'Oct 23, 2024 • 14:40 WIB',
          distinguishingMarkings: 'Clear bumper case, dog wallpaper visible on lockscreen',
          finderInfo: 'Staff ID: Budi Santoso (Ground Ops)',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Custody Intake Log'
        },
        aiBreakdown: {
          locationProximity: {
            score: 98,
            desc: 'Same terminal gate & departure lounge corridor'
          },
          timeDelta: {
            score: 95,
            desc: 'Found exactly 25 mins after reported loss event'
          },
          featureSimilarity: {
            score: 92,
            desc: 'Matching clear case model and dog lockscreen'
          }
        }
      },
      {
        id: 'M-4088',
        tag: 'Auto-Paired',
        tagType: 'navy',
        timeAgo: '18m ago',
        confidenceScore: 88,
        category: 'Personal Item / Wallet',
        lostReport: {
          id: 'L-2039',
          title: 'Bellroy Leather Wallet',
          category: 'Personal Item / Wallet',
          colorFinish: 'Caramel Brown vegetable-tanned leather',
          location: 'Food Court Area, Terminal 3',
          dateTime: 'Oct 23, 2024 • 12:50 WIB',
          distinguishingMarkings: 'Embossed owl logo on corner, driver license with name Siti',
          contactName: 'Siti Rahma',
          contactEmail: 'siti.r@outlook.com',
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Reported Photo'
        },
        foundReport: {
          id: 'F-3175',
          title: 'Brown Bi-fold Wallet',
          category: 'Personal Item / Wallet',
          colorFinish: 'Brown Leather with card slots',
          location: 'Near Starbucks F&B counter',
          dateTime: 'Oct 23, 2024 • 13:10 WIB',
          distinguishingMarkings: 'Contains various reward cards and Indonesian national ID',
          finderInfo: 'Staff ID: Rian H. (F&B Floor Team)',
          image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Custody Intake Log'
        },
        aiBreakdown: {
          locationProximity: {
            score: 94,
            desc: 'Food court adjacent to Starbucks counter'
          },
          timeDelta: {
            score: 91,
            desc: 'Found 20 mins post reported loss'
          },
          featureSimilarity: {
            score: 86,
            desc: 'Brand, leather texture, and card contents correspond'
          }
        }
      },
      {
        id: 'M-4075',
        tag: 'Auto-Paired',
        tagType: 'navy',
        timeAgo: '1h ago',
        confidenceScore: 82,
        category: 'Luggage / Suitcase',
        lostReport: {
          id: 'L-2022',
          title: 'Samsonite Luggage Navy',
          category: 'Luggage / Hardcase',
          colorFinish: 'Deep Navy Blue with silver telescopic handle',
          location: 'Baggage Carousel 4',
          dateTime: 'Oct 23, 2024 • 11:20 WIB',
          distinguishingMarkings: 'Red ribbon tied to top handle for identification',
          contactName: 'Michael Chen',
          contactEmail: 'mchen.corp@gmail.com',
          image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Reported Photo'
        },
        foundReport: {
          id: 'F-3160',
          title: 'Blue Rolling Suitcase',
          category: 'Luggage / Hardcase',
          colorFinish: 'Navy Blue hard shell with 4 spinner wheels',
          location: 'Arrival Hall Belt 4 baggage reclaim',
          dateTime: 'Oct 23, 2024 • 11:45 WIB',
          distinguishingMarkings: 'Red ribbon on handle, flight tag GA-412',
          finderInfo: 'Staff ID: Bambang S. (Baggage Handling Lead)',
          image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Custody Intake Log'
        },
        aiBreakdown: {
          locationProximity: {
            score: 90,
            desc: 'Exact carousel belt location'
          },
          timeDelta: {
            score: 85,
            desc: 'Found during carousel clearing sweep'
          },
          featureSimilarity: {
            score: 82,
            desc: 'Red ribbon marker and luggage dimensions align'
          }
        }
      },
      {
        id: 'M-4062',
        tag: 'Auto-Paired',
        tagType: 'navy',
        timeAgo: '3h ago',
        confidenceScore: 76,
        category: 'Eyewear / Accessories',
        lostReport: {
          id: 'L-2005',
          title: 'Ray-Ban Wayfarer Black',
          category: 'Eyewear / Accessories',
          colorFinish: 'Classic Black acetate frame, polarized dark green lenses',
          location: 'Security Checkpoint A',
          dateTime: 'Oct 23, 2024 • 09:15 WIB',
          distinguishingMarkings: 'Tiny engraving RB on upper corner of left lens',
          contactName: 'Clara Oswald',
          contactEmail: 'clara.o@yahoo.com',
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Reported Photo'
        },
        foundReport: {
          id: 'F-3140',
          title: 'Sunglasses in Hard Case',
          category: 'Eyewear / Accessories',
          colorFinish: 'Black frame sunglasses inside black leatherette snap case',
          location: 'Tray Return Line 2 at Security Point A',
          dateTime: 'Oct 23, 2024 • 09:40 WIB',
          distinguishingMarkings: 'Wayfarer style with Ray-Ban microfiber cloth inside',
          finderInfo: 'Staff ID: Agus W. (Security Inspector)',
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
          imageTag: 'Custody Intake Log'
        },
        aiBreakdown: {
          locationProximity: {
            score: 88,
            desc: 'Same screening tray x-ray station'
          },
          timeDelta: {
            score: 80,
            desc: 'Found 25 mins later in empty tray'
          },
          featureSimilarity: {
            score: 75,
            desc: 'Classic frame style and authentic case verified'
          }
        }
      }
    ];
  }
}

export default MatchReviewModel;
