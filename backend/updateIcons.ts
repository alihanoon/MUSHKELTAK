import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service";

dotenv.config({ path: "../.env" });

const ICON_MAPPING: Record<string, string> = {
  "النظافة وإدارة النفايات": "Recycle",
  "تنظيم الأبنية والتراخيص": "HardHat",
  "تنظيم الشوارع والإنارة": "TrafficCone",
  "الرقابة الصحية على المحلات": "ClipboardCheck",
  "تنظيم الأسواق والبسطات": "ShoppingBag",
  "الحدائق والمتنزهات": "TreePine",
};

const updateIcons = async () => {
    let uri = process.env.MONGODB_URI;
    if(!uri) {
      dotenv.config({ path: ".env" });
      uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mushkeltak";
    }

    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB...");

        const services = await Service.find();
        for (const service of services) {
            const iconName = ICON_MAPPING[service.name];
            if (iconName) {
                service.icon = iconName;
                await service.save();
                console.log(`Updated icon for ${service.name} to ${iconName}`);
            }
        }

        console.log("Icons updated successfully!");
        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("Error updating icons:", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

updateIcons();
