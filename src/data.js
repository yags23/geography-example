/*
  Australia Population Quest data

  Teacher update note:
  - Population figures are from the ABS Estimated Resident Population release
    for 30 September 2025. The ABS state table publishes population in '000,
    so these values are converted to people and rounded to the nearest 100.
  - To update the app later, replace the population values below, update the
    populationReferenceDate/sourceRelease fields, and the app will recalculate
    population density automatically.
  - Land areas are total area in square kilometres from Geoscience Australia.
*/

window.AUSTRALIA_QUEST_DATA = {
  meta: {
    title: "Australia Population Quest",
    subtitle: "Explore where Australians live",
    populationReferenceDate: "30 September 2025",
    nationalPopulation: 27724744,
    populationSource: "Australian Bureau of Statistics, National, state and territory population, September 2025",
    populationSourceUrl: "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/sep-2025",
    sourceRelease: "Released 19 March 2026",
    populationNote: "State and territory ERP values are rounded from the ABS table shown in thousands. Other Territories are included in the Australian total but not in the classroom state/territory list.",
    landAreaSource: "Geoscience Australia, Area of Australia - States and Territories",
    landAreaSourceUrl: "https://www.ga.gov.au/scientific-topics/national-location-information/dimensions/area-of-australia-states-and-territories"
  },

  states: [
    {
      id: "wa",
      name: "Western Australia",
      short: "WA",
      type: "state",
      capital: "Perth",
      population: 3061700,
      areaKm2: 2527013,
      mapClass: "map-wa",
      colour: "bg-emerald-600",
      coastline: "Long Indian Ocean coastline with people concentrated in the south-west.",
      climate: "Mostly arid inland, tropical in the north, and milder around Perth and the south-west.",
      transport: "Perth is the main transport hub and distances to other capitals are very large.",
      availableLand: "Very high away from Perth, but water, distance and environment matter.",
      interestingFact: "Western Australia is the largest state by land area, covering about one-third of Australia.",
      patternHint: "Huge area does not always mean huge population.",
      cityScores: {
        densityRoom: 5,
        climate: 2,
        transport: 2,
        coastline: 5,
        capitalAccess: 2,
        availableLand: 5
      }
    },
    {
      id: "nt",
      name: "Northern Territory",
      short: "NT",
      type: "territory",
      capital: "Darwin",
      population: 265500,
      areaKm2: 1347791,
      mapClass: "map-nt",
      colour: "bg-amber-600",
      coastline: "Northern coastline with Darwin as the main coastal capital.",
      climate: "Tropical north and very dry inland regions.",
      transport: "Darwin and Alice Springs are important hubs, with long travel distances.",
      availableLand: "Very high, with careful planning needed for water, climate and Country.",
      interestingFact: "The Northern Territory has the lowest population in this set but one of the largest land areas.",
      patternHint: "Remote and dry areas usually have fewer people per square kilometre.",
      cityScores: {
        densityRoom: 5,
        climate: 2,
        transport: 2,
        coastline: 3,
        capitalAccess: 2,
        availableLand: 5
      }
    },
    {
      id: "qld",
      name: "Queensland",
      short: "QLD",
      type: "state",
      capital: "Brisbane",
      population: 5692600,
      areaKm2: 1729742,
      mapClass: "map-qld",
      colour: "bg-sky-600",
      coastline: "Long east coast with many coastal cities and towns.",
      climate: "Tropical in the north and subtropical in the south-east.",
      transport: "Strong coastal transport links, with Brisbane as the largest hub.",
      availableLand: "Moderate to high, especially away from the south-east coast.",
      interestingFact: "Queensland has many large coastal population centres, not only one big capital city.",
      patternHint: "Queensland shows how coasts and climate can attract people.",
      cityScores: {
        densityRoom: 4,
        climate: 3,
        transport: 4,
        coastline: 5,
        capitalAccess: 3,
        availableLand: 4
      }
    },
    {
      id: "sa",
      name: "South Australia",
      short: "SA",
      type: "state",
      capital: "Adelaide",
      population: 1908200,
      areaKm2: 984321,
      mapClass: "map-sa",
      colour: "bg-lime-700",
      coastline: "Southern coastline, with Adelaide close to Gulf St Vincent.",
      climate: "Mediterranean near Adelaide and much drier inland.",
      transport: "Adelaide is a major southern hub and inland routes connect to the centre.",
      availableLand: "High inland, with water and heat important planning questions.",
      interestingFact: "Most South Australians live in or near Adelaide, even though the state is much larger than the city.",
      patternHint: "Capital cities can hold a large share of a state's people.",
      cityScores: {
        densityRoom: 4,
        climate: 3,
        transport: 3,
        coastline: 3,
        capitalAccess: 3,
        availableLand: 4
      }
    },
    {
      id: "nsw",
      name: "New South Wales",
      short: "NSW",
      type: "state",
      capital: "Sydney",
      population: 8624500,
      areaKm2: 801150,
      mapClass: "map-nsw",
      colour: "bg-blue-700",
      coastline: "Busy east coast with Sydney, Newcastle, Wollongong and many coastal towns.",
      climate: "Temperate coast, cooler mountains and drier inland regions.",
      transport: "Sydney is Australia's largest city and a major road, rail, air and port hub.",
      availableLand: "Lower near Sydney and the coast, higher inland.",
      interestingFact: "New South Wales has the highest population of any Australian state or territory.",
      patternHint: "The most populated places are strongly linked to big coastal cities.",
      cityScores: {
        densityRoom: 2,
        climate: 4,
        transport: 5,
        coastline: 5,
        capitalAccess: 5,
        availableLand: 3
      }
    },
    {
      id: "act",
      name: "Australian Capital Territory",
      short: "ACT",
      type: "territory",
      capital: "Canberra",
      population: 486200,
      areaKm2: 2358,
      mapClass: "map-act",
      colour: "bg-teal-700",
      coastline: "Landlocked territory surrounded by New South Wales.",
      climate: "Cooler inland climate with warm summers and cold winters.",
      transport: "Canberra has strong road and air links, especially to Sydney and Melbourne.",
      availableLand: "Limited compared with larger states and territories.",
      interestingFact: "The ACT is small in area, so its population density is the highest in this activity.",
      patternHint: "Small area can make density high, even with a smaller population.",
      cityScores: {
        densityRoom: 1,
        climate: 3,
        transport: 4,
        coastline: 1,
        capitalAccess: 4,
        availableLand: 1
      }
    },
    {
      id: "vic",
      name: "Victoria",
      short: "VIC",
      type: "state",
      capital: "Melbourne",
      population: 7104300,
      areaKm2: 227444,
      mapClass: "map-vic",
      colour: "bg-cyan-700",
      coastline: "Southern coastline with Melbourne around Port Phillip Bay.",
      climate: "Mostly temperate, with cooler highlands and changeable coastal weather.",
      transport: "Melbourne is a very large transport, port and rail hub.",
      availableLand: "Lower around Melbourne, with regional growth corridors outside the capital.",
      interestingFact: "Victoria has the second highest population but one of the smallest land areas.",
      patternHint: "High population plus smaller area creates high density.",
      cityScores: {
        densityRoom: 2,
        climate: 4,
        transport: 5,
        coastline: 4,
        capitalAccess: 5,
        availableLand: 2
      }
    },
    {
      id: "tas",
      name: "Tasmania",
      short: "TAS",
      type: "state",
      capital: "Hobart",
      population: 576700,
      areaKm2: 68401,
      mapClass: "map-tas",
      colour: "bg-green-700",
      coastline: "Island coastline with many bays and smaller coastal settlements.",
      climate: "Cool temperate climate with mountains, forests and west coast rain.",
      transport: "Hobart and Launceston are key hubs; Bass Strait separates Tasmania from the mainland.",
      availableLand: "Moderate, with mountains, forests and protected areas shaping choices.",
      interestingFact: "Tasmania is Australia's island state.",
      patternHint: "Being an island changes transport and settlement patterns.",
      cityScores: {
        densityRoom: 3,
        climate: 4,
        transport: 2,
        coastline: 5,
        capitalAccess: 2,
        availableLand: 3
      }
    }
  ],

  quiz: [
    {
      question: "Which state or territory has the highest population?",
      options: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
      answer: "New South Wales",
      explanation: "New South Wales has the largest population in the ABS September 2025 data."
    },
    {
      question: "Which territory has the lowest population?",
      options: ["Northern Territory", "Australian Capital Territory", "Tasmania", "South Australia"],
      answer: "Northern Territory",
      explanation: "The Northern Territory has fewer people than the ACT in this dataset."
    },
    {
      question: "Which Australian state is an island?",
      options: ["Tasmania", "Victoria", "Queensland", "South Australia"],
      answer: "Tasmania",
      explanation: "Tasmania is separated from mainland Australia by Bass Strait."
    },
    {
      question: "Which state has the largest land area?",
      options: ["Western Australia", "Queensland", "Northern Territory", "New South Wales"],
      answer: "Western Australia",
      explanation: "Western Australia covers about one-third of the country."
    },
    {
      question: "What is the capital of Queensland?",
      options: ["Brisbane", "Perth", "Darwin", "Hobart"],
      answer: "Brisbane",
      explanation: "Brisbane is Queensland's capital city."
    },
    {
      question: "What does population density mean?",
      options: [
        "How many people live in each square kilometre",
        "How many people move interstate each year",
        "The total coastline of a place",
        "The distance from one capital city to another"
      ],
      answer: "How many people live in each square kilometre",
      explanation: "Population density compares people with land area."
    },
    {
      question: "Why do more Australians live near the coast?",
      options: [
        "Coasts often have major cities, ports, jobs, transport and milder climates",
        "Coastal areas always have the largest land area",
        "Inland Australia has no towns",
        "All capital cities are on islands"
      ],
      answer: "Coasts often have major cities, ports, jobs, transport and milder climates",
      explanation: "Settlement is shaped by jobs, transport, climate, water and access."
    },
    {
      question: "Why does Western Australia have a large area but lower population density?",
      options: [
        "Much of the state is remote or dry, and many people live near Perth and the coast",
        "Western Australia has no coastline",
        "Perth is not a capital city",
        "It is smaller than Victoria"
      ],
      answer: "Much of the state is remote or dry, and many people live near Perth and the coast",
      explanation: "A very large area with people concentrated in a few places means lower density."
    },
    {
      question: "Which place has the highest population density in this activity?",
      options: ["Australian Capital Territory", "Victoria", "New South Wales", "Tasmania"],
      answer: "Australian Capital Territory",
      explanation: "The ACT has a small area and a large city, which raises its density."
    },
    {
      question: "Which capital city is in the Northern Territory?",
      options: ["Darwin", "Canberra", "Adelaide", "Sydney"],
      answer: "Darwin",
      explanation: "Darwin is the capital of the Northern Territory."
    }
  ],

  summaryPatterns: [
    "Most Australians live near the coast and in capital cities.",
    "Large land area does not always mean a large population.",
    "Smaller places can have high population density.",
    "Climate, transport and jobs help explain where people settle.",
    "Remote and dry regions usually have fewer people per square kilometre."
  ]
};
