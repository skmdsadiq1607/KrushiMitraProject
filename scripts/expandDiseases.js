import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const diseasesPath = path.resolve(__dirname, '../knowledge-base/diseases/diseases.json');
const current = JSON.parse(fs.readFileSync(diseasesPath, 'utf-8'));

const additional = [
  {
    id: 'tomato-bacterial-wilt',
    name: 'Tomato Bacterial Wilt',
    scientificName: 'Ralstonia solanacearum',
    crop: 'Tomato',
    type: 'Disease',
    pathogen: 'Bacteria (Betaproteobacteria: Burkholderiaceae)',
    severity: 'Critical',
    diseaseCycle: 'Soil-borne vascular pathogen that survives for years in soil, irrigation canals, and weeds. Penetrates root wounds caused by transplanting or nematode feeding. Colonizes xylem vessels and produces extracellular polysaccharides that clog water flow, leading to rapid green wilting.',
    favorableConditions: {
      temperature: '30°C - 35°C',
      humidity: 'High soil moisture / saturated waterlogged fields',
      weatherFactor: 'High soil temperatures combined with waterlogging after heavy rainfall.'
    },
    symptoms: [
      'Rapid, sudden daytime wilting of whole plant while leaves remain green (green wilt), recovering at night initially.',
      'Permanent wilting within 2 to 4 days, with foliage drying up completely.',
      'Brown vascular discoloration visible when lower stem is sliced lengthwise.',
      'Diagnostic Sign (Bacterial Streaming Test): Cut lower stem segment suspended in clear water streams milky white bacterial threads within 60 seconds.'
    ],
    causes: [
      'Ralstonia solanacearum soil bacterial population entering through root wounds or root-knot nematode feeding sites.'
    ],
    prevention: [
      'Crop Rotation: Rotate tomato strictly with non-host crops like maize, sorghum, or paddy for 3-4 years.',
      'Resistant Varieties: Plant ICAR-IIHR bacterial-wilt resistant hybrids (Arka Ananya, Arka Abha, Arka Alok, Arka Saurabh).',
      'Soil Solarization: Cover moist nursery beds with transparent polyethylene sheet (25 micron) for 4 weeks in peak summer.',
      'Grafting: Graft high-yielding scions onto bacterial wilt-resistant rootstocks (Solanum torvum).'
    ],
    management: [
      'Field Sanitation: Rogue and carefully pull out wilted plants with root ball into bags; burn or solarize outside field.',
      'Bio-Drenching: Soil drench with Pseudomonas fluorescens @ 10g/L or Bacillus subtilis @ 5g/L around root zones at transplanting and 20 days later.',
      'Chemical Drenching: Drench soil around root zones with Copper Oxychloride 50% WP @ 3.0 g/L + Streptocycline @ 0.2 g/L water.',
      'Bio-fumigation: Incorporate brassica residues (mustard cake @ 200 kg/acre) into moist soil 3 weeks prior to planting.'
    ],
    preventionProtocol: {
      seedTreatment: [
        'Seed treatment with Streptocycline @ 0.2g/L for 30 minutes, followed by Trichoderma viride @ 10g/kg seed.',
        'Dip seedling roots in Pseudomonas fluorescens (20g/L water) for 20 minutes before transplanting.'
      ],
      culturalPractices: [
        'Apply agricultural lime (1-2 tons/ha) in acidic soils to raise pH above 6.5, which suppresses Ralstonia.',
        'Control root-knot nematodes using Paecilomyces lilacinus to prevent root entry wounds.'
      ],
      vectorAndPhysical: [
        'Avoid flood irrigation flowing from infested fields down to uninfected plots.'
      ],
      resistantCultivars: [
        'ICAR-IIHR Bacterial Wilt Resistant: Arka Abha, Arka Alok, Arka Ananya, Arka Saurabh, Pant Bahar.'
      ]
    },
    curativeProtocol: {
      biologicalCure: [
        'Soil drenching with Pseudomonas fluorescens (1x10^9 CFU/g) @ 10g/L water (200ml solution per plant) around root zone.',
        'Apply enriched Neem cake @ 200 kg/acre during land preparation.'
      ],
      chemicalCure: [
        {
          chemical: 'Copper Oxychloride 50% WP + Streptocycline',
          dosage: '3.0 g COC + 0.2 g Streptocycline per liter of water',
          method: 'Soil drenching around collar region of healthy plants adjacent to wilted foci (150-200ml/plant)',
          waitingPeriodDays: 15,
          precautions: 'Do not apply as foliar spray for vascular wilt; soil drenching is mandatory.'
        }
      ],
      sanitation: [
        'Spot-drench the hole from which the wilted plant was removed with 500ml of 0.3% Copper Oxychloride solution.'
      ]
    },
    source: 'ICAR-IIHR Bengaluru Solanaceous Wilt Advisory'
  },
  {
    id: 'rice-brown-spot',
    name: 'Rice Brown Spot',
    scientificName: 'Bipolaris oryzae (Cochliobolus miyabeanus)',
    crop: 'Rice / Paddy',
    type: 'Disease',
    pathogen: 'Fungus (Ascomycota: Pleosporaceae)',
    severity: 'Moderate',
    diseaseCycle: 'Seed-borne and air-borne fungus. Survives in seed coats and infected crop stubble. Conidia spread via air currents and rain splash. Intensifies on crops suffering from potassium, nitrogen, or silica deficits in nutrient-poor soils.',
    favorableConditions: {
      temperature: '25°C - 30°C',
      humidity: 'Above 85%',
      weatherFactor: 'Cloudy weather with high humidity on crops growing in unfertilized, potassium-deficient, or drought-stressed soils.'
    },
    symptoms: [
      'Small, circular to oval, reddish-brown to dark brown spots uniformly scattered across leaf blades, leaf sheaths, and glumes.',
      'Mature spots display light gray or dirty white centers surrounded by dark reddish-brown margins, resembling sesame seeds.',
      'Severely spotted leaves turn yellow, wither, and die prematurely from leaf tip downward.',
      'Grain Infection: Dark brown to black spots on glumes causing grain discoloration, poor milling quality, and chaffy empty grains.'
    ],
    causes: [
      'Bipolaris oryzae fungal conidia on infected seeds or stubble.',
      'Nutrient-starved soil conditions with acute potassium and silicon deficit.'
    ],
    prevention: [
      'Hot Water Seed Treatment: Soak seeds in hot water at 52°C-54°C for 10-12 minutes to kill internal seed mycelium.',
      'Chemical Seed Dressing: Treat seeds with Carbendazim 50% WP @ 2g/kg seed or Thiram 75% WP @ 3g/kg seed.',
      'Nutrient Correction: Apply recommended doses of Potash (MOP @ 25 kg/acre) and Silicon to eliminate physiological susceptibility.',
      'Field Sanitation: Destroy infected crop stubble and weeds along field borders.'
    ],
    management: [
      'Foliar Biocontrol: Spray Pseudomonas fluorescens @ 5g/L water at tillering and panicle initiation stages.',
      'Curative Chemical Spray: Spray Mancozeb 75% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L at early symptom detection.',
      'Alternative Systemic: Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Hexaconazole 5% EC @ 2.0 ml/L.',
      'Pre-Harvest Interval (PHI): Observe a minimum waiting period of 25 days before harvest.'
    ],
    preventionProtocol: {
      seedTreatment: [
        'Treat seed with Thiram 75% WP @ 3g/kg seed or Carbendazim 12% + Mancozeb 63% WP @ 2g/kg seed.'
      ],
      culturalPractices: [
        'Correct soil fertility: Apply 10 tons/ha FYM and ensure full recommended potassium dose.',
        'Avoid moisture stress in rainfed upland paddy fields.'
      ],
      vectorAndPhysical: [],
      resistantCultivars: [
        'Tolerant varieties: IR 36, Bala, CR 1009, Rasi.'
      ]
    },
    curativeProtocol: {
      biologicalCure: [
        'Pseudomonas fluorescens foliar spray @ 1 kg/acre in 200L water.'
      ],
      chemicalCure: [
        {
          chemical: 'Propiconazole 25% EC',
          dosage: '1.0 ml per liter of water (200 ml/acre)',
          method: 'Foliar spray ensuring coverage of flag leaf and panicle',
          waitingPeriodDays: 25,
          precautions: 'Systemic triazole with excellent curative eradication.'
        },
        {
          chemical: 'Mancozeb 75% WP',
          dosage: '2.5 g per liter of water',
          method: 'Protective foliar application',
          waitingPeriodDays: 15,
          precautions: 'Ensure thorough wetting.'
        }
      ],
      sanitation: [
        'Burn or deeply plow under stubble after harvest.'
      ]
    },
    source: 'ICAR-IIRR Rice Pathology & State Extension Manual'
  },
  {
    id: 'chilli-powdery-mildew',
    name: 'Chilli Powdery Mildew',
    scientificName: 'Leveillula taurica',
    crop: 'Chilli / Pepper',
    type: 'Disease',
    pathogen: 'Fungus (Ascomycota: Erysiphaceae)',
    severity: 'Moderate',
    diseaseCycle: 'Endophytic powdery mildew. Fungal mycelium grows internally within leaf mesophyll. Conidiophores emerge through stomata on leaf undersides, dispersing airborne conidia in dry, warm afternoons with high morning humidity.',
    favorableConditions: {
      temperature: '20°C - 30°C',
      humidity: '60% - 85%',
      weatherFactor: 'Cool, humid mornings followed by warm, dry afternoons during flowering stages.'
    },
    symptoms: [
      'Upper Leaf Surface: Bright yellow chlorotic patches corresponding to fungal colonies inside leaf tissue.',
      'Lower Leaf Surface: White powdery or dusty fungal growth emerging on leaf undersides beneath yellow chlorotic blotches.',
      'Severe upward curling and rolling of leaf margins.',
      'Heavy premature defoliation leaving plants bare (whiptail appearance), directly exposing fruits to solar sunscald.'
    ],
    causes: [
      'Airborne conidia of Leveillula taurica blowing into fields from weed hosts.'
    ],
    prevention: [
      'Prophylactic Sulfur Spray: Spray Wettable Sulphur 80% WDG @ 2.5-3.0 g/L water at early vegetative stage.',
      'Adequate Spacing: Maintain 60 x 45 cm spacing to avoid dense, shaded canopies.',
      'Crop Rotation: Avoid cultivating chilli in continuous succession after tomato or brinjal.'
    ],
    management: [
      'Curative Systemic Spray: Spray Tebuconazole 25.9% EC @ 1.25 ml/L or Myclobutanil 10% WP @ 1.0 g/L water.',
      'Alternative Systemic: Azoxystrobin 23% SC @ 1.0 ml/L or Difenoconazole 25% EC @ 1.0 ml/L.',
      'Bio-control: Foliar spray of Ampelomyces quisqualis @ 5g/L or Neem oil 1500 ppm @ 3-5 ml/L.',
      'Pre-Harvest Interval (PHI): Observe a minimum waiting period of 5 days before picking chillies.'
    ],
    preventionProtocol: {
      seedTreatment: [],
      culturalPractices: [
        'Maintain optimum weed-free borders.',
        'Avoid excessive nitrogen that produces tender, susceptible foliage.'
      ],
      vectorAndPhysical: [],
      resistantCultivars: [
        'Tolerant varieties: Arka Suphal, Pusa Jwala, Pant C-1.'
      ]
    },
    curativeProtocol: {
      biologicalCure: [
        'Neem oil 1500 ppm @ 4 ml/L water with 1 ml liquid soap emulsifier.',
        'Ampelomyces quisqualis @ 5g/L water sprayed during humid evenings.'
      ],
      chemicalCure: [
        {
          chemical: 'Wettable Sulphur 80% WDG',
          dosage: '2.5 - 3.0 g per liter of water (500-600 g/acre)',
          method: 'Foliar spray ensuring undersides of leaves are covered',
          waitingPeriodDays: 3,
          precautions: 'Do not spray when ambient temperature exceeds 35°C to avoid leaf burn.'
        },
        {
          chemical: 'Tebuconazole 25.9% EC',
          dosage: '1.25 ml per liter of water',
          method: 'Foliar spray at early powdery patch emergence',
          waitingPeriodDays: 5,
          precautions: 'Systemic triazole with eradicative and vapor activity.'
        }
      ],
      sanitation: [
        'Collect and destroy shed leaves from under the canopy.'
      ]
    },
    source: 'ICAR-IIHR Vegetable Pathology Advisory'
  },
  {
    id: 'cotton-bollworm-complex',
    name: 'Cotton Bollworm Complex (American & Pink)',
    scientificName: 'Helicoverpa armigera & Pectinophora gossypiella',
    crop: 'Cotton',
    type: 'Pest',
    pathogen: 'Insect (Lepidoptera: Noctuidae & Gelechiidae)',
    severity: 'Critical',
    diseaseCycle: 'Helicoverpa bores into squares and bolls, feeding with body half-outside. Pink bollworm neonates bore into bolls within 48 hours, sealing entrance holes and feeding internally on seeds and lint, diapausing in double seeds.',
    favorableConditions: {
      temperature: '25°C - 35°C',
      humidity: '60% - 80%',
      weatherFactor: 'Cloudy, warm weather during flowering and boll formation stages.'
    },
    symptoms: [
      'American Bollworm: Flared squares (bracteoles open outwards); round bore holes on bolls surrounded by green frass.',
      'Pink Bollworm: Rosette flower appearance where petals are tied together by larval silk and fail to open.',
      'Premature dropping of squares and young bolls.',
      'Bolls fail to open properly (bad opening); lint inside turns stained, discolored, and ruined by seed feeding.'
    ],
    causes: [
      'Adult moth oviposition on squares, flowers, and bolls.',
      'Survival of diapausing pink bollworm larvae in ginning mills, seed stores, and unplowed stalks.'
    ],
    prevention: [
      'Pheromone Monitoring: Install 5 pheromone traps per acre for Helicoverpa and 8 traps/acre for Pink Bollworm.',
      'Trap Cropping: Sow 2-3 rows of marigold or castor along borders to attract Helicoverpa oviposition.',
      'Crop Termination: Terminate cotton crop by end of January; strictly avoid ratooning cotton.',
      'Destruction of Stalks: Shred and plow down cotton stalks immediately after final harvest.'
    ],
    management: [
      'Egg Parasitoids: Release Trichogramma chilonis @ 60,000 eggs/acre at weekly intervals from square formation.',
      'Biopesticide: Spray HaNPV @ 250 LE/acre or Bacillus thuringiensis (Bt) @ 2g/L water.',
      'Targeted Insecticide (Early Stage): Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Flubendiamide 39.35% SC @ 0.4 ml/L.',
      'Curative Insecticide (Pink Bollworm): Spray Profenofos 50% EC @ 2.0 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L.',
      'Pre-Harvest Interval (PHI): Observe a minimum waiting period of 15 days before picking.'
    ],
    preventionProtocol: {
      seedTreatment: [],
      culturalPractices: [
        'Avoid monoculture ratooning of cotton.',
        'Install light traps to monitor adult moth emergence.'
      ],
      vectorAndPhysical: [
        'Install 8-10 Gossyplure pheromone traps per acre to trigger ETL-based spray decisions.'
      ],
      resistantCultivars: [
        'Bollgard II (BG-II) Bt cotton hybrids with dual Cry toxins.'
      ]
    },
    curativeProtocol: {
      biologicalCure: [
        'Release Trichogramma chilonis @ 60,000/acre at weekly intervals starting at 45 days.',
        'Spray Beauveria bassiana @ 5g/L water or Neem oil 1500 ppm @ 5 ml/L.'
      ],
      chemicalCure: [
        {
          chemical: 'Chlorantraniliprole 18.5% SC (Coragen)',
          dosage: '0.3 - 0.4 ml per liter of water (60-80 ml/acre)',
          method: 'Foliar spray targeting young squares and bolls',
          waitingPeriodDays: 15,
          precautions: 'High ovicidal and larvicidal activity against Helicoverpa.'
        },
        {
          chemical: 'Profenofos 50% EC',
          dosage: '2.0 ml per liter of water (400 ml/acre)',
          method: 'Foliar spray for pink bollworm neonate larvae',
          waitingPeriodDays: 20,
          precautions: 'Organophosphate with strong penetrating action into squares.'
        },
        {
          chemical: 'Emamectin Benzoate 5% SG',
          dosage: '0.4 - 0.5 g per liter of water (80-100 g/acre)',
          method: 'Foliar spray during peak evening moth flight',
          waitingPeriodDays: 14,
          precautions: 'Stomach and contact action.'
        }
      ],
      sanitation: [
        'Collect and bury dropped squares and flared bolls regularly.'
      ]
    },
    source: 'ICAR-CICR Nagpur Pink Bollworm Management Protocol'
  },
  {
    id: 'rice-yellow-stem-borer',
    name: 'Rice Yellow Stem Borer',
    scientificName: 'Scirpophaga incertulas',
    crop: 'Rice / Paddy',
    type: 'Pest',
    pathogen: 'Insect (Lepidoptera: Crambidae)',
    severity: 'High',
    diseaseCycle: 'Monophagous pest strictly attacking rice. Female moths lay egg masses covered with yellowish-brown buff hairs on upper leaf surfaces. Newly hatched larvae bore into stem internodes within 24-48 hours, feeding on internal vascular tissue.',
    favorableConditions: {
      temperature: '25°C - 30°C',
      humidity: 'Above 70%',
      weatherFactor: 'Warm humid nights favoring nocturnal moth flight and mating.'
    },
    symptoms: [
      'Dead Heart (Vegetative Stage): Drying and death of central tiller; withered central leaf pulls out easily.',
      'White Earhead (Reproductive Stage): Panicle emerges completely white, erect, and empty (chaffy) with zero grain filling.',
      'Tiny entry pinholes visible on lower stem internodes accompanied by internal larval frass.'
    ],
    causes: [
      'Scirpophaga incertulas larvae boring inside rice culms.',
      'Staggered planting in rice command area providing continuous green hosts.'
    ],
    prevention: [
      'Clipping Seedling Tips: Clip 2-3 cm off seedling tips at transplanting to eliminate stem borer egg masses.',
      'Pheromone Trapping: Install 5 Scirpophaga pheromone traps per acre for early moth monitoring.',
      'Biological Parasitoid: Release egg parasitoid Trichogramma japonicum @ 40,000/acre at weekly intervals from 30 days after transplanting.',
      'Stubble Management: Plow and submerge rice stubble immediately after harvest.'
    ],
    management: [
      'Granular Application: Broadcast Chlorantraniliprole 0.4% GR @ 4 kg/acre or Cartap hydrochloride 4% GR @ 8 kg/acre in 2-3 cm standing water at tillering.',
      'Foliar Spray: Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Flubendiamide 39.35% SC @ 0.25 ml/L water (60 ml/acre).',
      'Alternative Systemic: Cartap hydrochloride 50% SP @ 2.0 g/L or Fipronil 5% SC @ 2.0 ml/L.',
      'Pre-Harvest Interval (PHI): Observe a minimum waiting period of 25 days before harvest.'
    ],
    preventionProtocol: {
      seedTreatment: [],
      culturalPractices: [
        'Synchronize planting within a 15-day community window.',
        'Clip top 2-3 cm of nursery seedling leaves before transplanting.'
      ],
      vectorAndPhysical: [
        'Install 1 light trap per 2-3 acres to monitor adult moth flights.'
      ],
      resistantCultivars: [
        'Tolerant varieties: IR 20, IR 36, Ratna, Vikas.'
      ]
    },
    curativeProtocol: {
      biologicalCure: [
        'Release Trichogramma japonicum @ 40,000 adults/acre at weekly intervals (3-4 releases).',
        'Azadirachtin 1500 ppm @ 3-5 ml/L water sprayed during early vegetative tillering.'
      ],
      chemicalCure: [
        {
          chemical: 'Chlorantraniliprole 0.4% GR (Ferterra)',
          dosage: '4.0 kg per acre broadcast into 2-3 cm standing water',
          method: 'Soil broadcast at early tillering stage; maintain standing water for 48 hours',
          waitingPeriodDays: 30,
          precautions: 'Long-lasting systemic root uptake giving 25-30 days of internal stem borer protection.'
        },
        {
          chemical: 'Chlorantraniliprole 18.5% SC (Coragen)',
          dosage: '0.3 ml per liter of water (60 ml in 200L water/acre)',
          method: 'Foliar spray before larvae bore deep inside stems',
          waitingPeriodDays: 25,
          precautions: 'Apply when moth flight reaches economic threshold (ETL).'
        },
        {
          chemical: 'Cartap Hydrochloride 50% SP',
          dosage: '2.0 g per liter of water (400 g/acre)',
          method: 'Foliar spray with thorough lower stem wetting',
          waitingPeriodDays: 21,
          precautions: 'Nereistoxin analogue causing paralysis of borer larvae.'
        }
      ],
      sanitation: [
        'Plow under rice stubble deeply after harvest; do not leave tall stubble standing.'
      ]
    },
    source: 'ICAR-IIRR Integrated Pest Management Manual'
  },
  {
    id: 'wheat-leaf-rust',
    name: 'Brown / Leaf Rust of Wheat',
    scientificName: 'Puccinia triticina (Puccinia recondita)',
    crop: 'Wheat',
    type: 'Disease',
    pathogen: 'Fungus (Basidiomycota: Pucciniaceae)',
    severity: 'High',
    diseaseCycle: 'Airborne obligate rust fungus that oversummers in southern and central hills of India. In February warm spells, urediniospores blow into central and northern plains, multiplying rapidly on leaf blades.',
    favorableConditions: {
      temperature: '18°C - 25°C',
      humidity: 'Above 80%',
      weatherFactor: 'Warm sunny days followed by cool humid nights with 4-6 hours of morning dew.'
    },
    symptoms: [
      'Small, round to oval, bright orange-brown to cinnamon-brown pustules scattered irregularly across leaf blade.',
      'Brown powdery spores rub off readily onto hands.',
      'Pustules occur predominantly on upper leaf surface, rarely on leaf sheaths.',
      'Leaves senesce and turn yellow prematurely, leading to reduced grain size and lower test weight.'
    ],
    causes: [
      'Airborne urediniospores of Puccinia triticina blowing in during February warm spells.'
    ],
    prevention: [
      'Resistant Varieties: Cultivate ICAR-IIWBR recommended brown-rust resistant wheat varieties (DBW 187, DBW 222, HD 3086, HD 2967, WH 1105).',
      'Timely Sowing: Complete sowing between Nov 1 and Nov 15.',
      'Balanced NPK: Avoid excess nitrogenous fertilizer; ensure adequate potassium.'
    ],
    management: [
      'Curative Chemical Spray: Spray Propiconazole 25% EC @ 1.0 ml/L (200 ml/acre in 200L water) or Tebuconazole 25.9% EC @ 1.0 ml/L at first pustule detection.',
      'Alternative Systemic: Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L.',
      'Repeat Spray: If warm humid weather continues, apply a second spray after 15 days.'
    ],
    preventionProtocol: {
      seedTreatment: [
        'Treat seed with Tebuconazole 2% DS @ 1.5g/kg seed or Carboxin 37.5% + Thiram 37.5% DS @ 2.5g/kg seed.'
      ],
      culturalPractices: [
        'Plant certified resistant cultivars recommended for your agro-climatic zone.'
      ],
      vectorAndPhysical: [],
      resistantCultivars: [
        'ICAR-IIWBR Varieties: DBW 187, DBW 222, DBW 303, HD 3226, HD 3086.'
      ]
    },
    curativeProtocol: {
      biologicalCure: [
        'Trichoderma viride 1% WP @ 5g/L water sprayed during early vegetative development.'
      ],
      chemicalCure: [
        {
          chemical: 'Propiconazole 25% EC',
          dosage: '1.0 ml per liter of water (200 ml/acre)',
          method: 'Foliar spray upon first detection of orange-brown pustules',
          waitingPeriodDays: 30,
          precautions: 'Systemic sterol demethylation inhibitor.'
        },
        {
          chemical: 'Tebuconazole 25.9% EC',
          dosage: '1.0 ml per liter of water',
          method: 'Foliar spray covering flag leaf and upper canopy',
          waitingPeriodDays: 30,
          precautions: 'Long-lasting 20-day residual protection.'
        }
      ],
      sanitation: [
        'Treat initial infected patches promptly to prevent regional wind dispersal.'
      ]
    },
    source: 'ICAR-IIWBR Karnal Wheat Rust Advisory'
  }
];

// Check duplicate IDs before appending
const existingIds = new Set(current.map(d => d.id));
const toAdd = additional.filter(a => !existingIds.has(a.id));
const combined = [...current, ...toAdd];

fs.writeFileSync(diseasesPath, JSON.stringify(combined, null, 2), 'utf-8');
console.log('Successfully expanded knowledge base! Previous count:', current.length, 'New total:', combined.length);
