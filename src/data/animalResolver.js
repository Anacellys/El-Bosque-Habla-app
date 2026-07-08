import { ANIMALS } from "@/data/animals";

export function getAnimalById(animalId) {
  return ANIMALS.find((a) => a.id === animalId) ?? null;
}

