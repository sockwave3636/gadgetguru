import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Gadget, GadgetCategory } from "@/types/gadget";

// Helper function to get collection name based on category
const getCollectionName = (category: GadgetCategory): string => {
  const categoryMap: Record<GadgetCategory, string> = {
    "Smartphone": "smartphones",
    "Laptop": "laptops", 
    "Headphones": "headphones",
    "Smartwatch": "smartwatches",
    "Tablet": "tablets",
    "Camera": "cameras",
    "Charger & Cables": "charger_cables",
    "Other": "others"
  };
  return categoryMap[category];
};

export const getAllGadgets = async (): Promise<Gadget[]> => {
  try {
    const categories: GadgetCategory[] = [
      "Smartphone", "Laptop", "Headphones", "Smartwatch", 
      "Tablet", "Camera", "Charger & Cables", "Other"
    ];
    
    const allGadgets: Gadget[] = [];
    
    for (const category of categories) {
      const collectionName = getCollectionName(category);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const categoryGadgets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
      })) as Gadget[];
      
      allGadgets.push(...categoryGadgets);
    }
    
    return allGadgets;
  } catch (error) {
    console.error("Error getting gadgets: ", error);
    throw error;
  }
};

export const getGadgetsByCategory = async (category: GadgetCategory): Promise<Gadget[]> => {
  try {
    const collectionName = getCollectionName(category);
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    })) as Gadget[];
  } catch (error) {
    console.error("Error getting gadgets by category: ", error);
    throw error;
  }
};

export const getGadgetById = async (id: string, category: GadgetCategory): Promise<Gadget | null> => {
  try {
    const collectionName = getCollectionName(category);
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate ? docSnap.data().createdAt.toDate() : new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate ? docSnap.data().updatedAt.toDate() : new Date(),
      } as Gadget;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting gadget: ", error);
    throw error;
  }
};
