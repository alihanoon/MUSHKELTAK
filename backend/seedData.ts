import mongoose from "mongoose";
import dotenv from "dotenv";
import Governorate from "./models/Governorate";
import Municipality from "./models/Municipality";
import Service from "./models/Service";

dotenv.config({ path: "../.env" }); // In case we run it from backend

// Copying data from frontend/constants.ts to ensure script runs standalone
const JORDAN_DATA = {
  "عمان": [
    "بلدية عمان الكبرى",
    "بلدية الجيزة الجديدة",
    "بلدية الموقر",
    "بلدية ناعور",
    "بلدية حسبان الجديدة",
    "بلدية أم البساتين"
  ],
  "إربد": [
    "بلدية إربد الكبرى",
    "بلدية غرب إربد",
    "بلدية الرمثا الجديدة",
    "بلدية سهل حوران",
    "بلدية الكفارات",
    "بلدية الشعلة",
    "بلدية السرو",
    "بلدية خالد بن الوليد",
    "بلدية اليرموك الجديدة",
    "بلدية معاذ بن جبل",
    "بلدية طبقة فحل",
    "بلدية شرحبيل بن حسنة"
  ],
  "الزرقاء": [
    "بلدية الزرقاء",
    "بلدية الرصيفة",
    "بلدية الهاشمية الجديدة",
    "بلدية بيرين الجديدة",
    "بلدية الظليل"
  ],
  "البلقاء": [
    "بلدية السلط الكبرى",
    "بلدية عين الباشا الجديدة",
    "بلدية ماحص",
    "بلدية الفحيص",
    "بلدية الشونة الوسطى",
    "بلدية دير علا الجديدة",
    "بلدية معدي الجديدة"
  ],
  "المفرق": [
    "بلدية المفرق الكبرى",
    "بلدية بلعما الجديدة",
    "بلدية رحاب الجديدة",
    "بلدية المنشية",
    "بلدية حوشا الجديدة",
    "بلدية الباسلية",
    "بلدية السرحان",
    "بلدية الخالدية"
  ],
  "الكرك": [
    "بلدية الكرك الكبرى",
    "بلدية مؤتة والمزار",
    "بلدية القطرانة",
    "بلدية مؤاب الجديدة",
    "بلدية شيحان",
    "بلدية طلال الجديدة",
    "بلدية الأغوار الجنوبية"
  ],
  "مادبا": [
    "بلدية مادبا الكبرى",
    "بلدية ذيبان الجديدة",
    "بلدية جبل بني حميدة",
    "بلدية لب ومليح"
  ],
  "جرش": [
    "بلدية جرش الكبرى",
    "بلدية النسيم",
    "بلدية باب عمان",
    "بلدية برما",
    "بلدية المعراض"
  ],
  "عجلون": [
    "بلدية عجلون الكبرى",
    "بلدية كفرنجة الجديدة",
    "بلدية الجنيد",
    "بلدية الشفا",
    "بلدية العيون"
  ],
  "معان": [
    "بلدية معان الكبرى",
    "بلدية الشوبك الجديدة",
    "بلدية إيل الجديدة",
    "بلدية الأشعري",
    "بلدية الجفر"
  ],
  "الطفيلة": [
    "بلدية الطفيلة الكبرى",
    "بلدية بصيرا",
    "بلدية القادسية",
    "بلدية الحسا"
  ],
  "العقبة": [
    "بلدية العقبة",
    "بلدية القويرة الجديدة",
    "بلدية وادي عربة"
  ]
};

const MUNICIPAL_SERVICES = [
  { id: "waste", name: "النظافة وإدارة النفايات" },
  { id: "building", name: "تنظيم الأبنية والتراخيص" },
  { id: "streets", name: "تنظيم الشوارع والإنارة" },
  { id: "health", name: "الرقابة الصحية على المحلات" },
  { id: "markets", name: "تنظيم الأسواق والبسطات" },
  { id: "parks", name: "الحدائق والمتنزهات" },
];


const seedDatabase = async () => {
    // If running from root use .env from root, otherwise adjust
    let uri = process.env.MONGODB_URI;
    if(!uri) {
      const result = dotenv.config({ path: ".env" });
      uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mushkeltak";
    }

    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await Governorate.deleteMany({});
        await Municipality.deleteMany({});
        await Service.deleteMany({});
        console.log("Cleared existing data");

        // Seed Governorates and Municipalities
        let govId = 1;
        let munId = 1;
        
        for (const [govName, municipalities] of Object.entries(JORDAN_DATA)) {
            const gov = await Governorate.create({ id: govId, name: govName });
            console.log(`Added Governorate: ${govName} with id: ${govId}`);

            for (const munName of municipalities) {
                await Municipality.create({ id: munId, name: munName, governorate: gov._id });
                munId++;
            }
            govId++;
        }

        // Seed Services
        let servId = 1;
        for (const service of MUNICIPAL_SERVICES) {
            await Service.create({ id: servId, name: service.name });
            console.log(`Added Service: ${service.name} with id: ${servId}`);
            servId++;
        }

        console.log("Data seeded successfully!");
        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
