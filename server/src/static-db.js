const db = [
  {
    name: "Gimbap",
    id: "testRecipe",
    author: "test author",
    ingredients: [
      { ingredient: "1 apple", id: 1 },
      { ingredient: "3 ounces chocolate", id: 2 },
    ],
    instructions: [
      {
        instruction:
          "Trim cucumber ends and cut it in half lengthwise. Using a spoon, scrape out the seeds from each half. Cut each half lengthwise into three long strips to make 6 strips total. Place cucumber strips on a plate, sprinkle all over with salt, and toss well to coat. Set aside.",
        id: 1,
      },
      {
        instruction:
          "In a small bowl, beat eggs with a pinch of salt. Lightly grease a 10-inch nonstick skillet with vegetable oil and heat over medium heat until warmed but not sizzling hot. Add half the egg, swirling to cover entire bottom of pan and cook until egg has just set on top. Using a rubber spatula, carefully free the egg round and transfer to a work surface to cool. Lightly re-grease pan if needed and repeat with remaining egg. Wipe out skillet.",
        id: 2,
      },
      {
        instruction: "Slice egg lengthwise into thin strips. Set aside.",
        id: 3,
      },
    ],
    notes: [
      { note: "Needs salt", id: 1 },
      { note: "Maybe add vinegar", id: 2 },
    ],
  },
  {
    name: "Carrot Cake",
    id: "testRecipe 2",
    author: "test author 2",
    ingredients: [
      { ingredient: "4 carrots", id: 1 },
      { ingredient: "2 ounces flour", id: 2 },
      { ingredient: "1 cup sugar", id: 3 },
    ],
    instructions: [
      {
        instruction: "Peel carrots",
        id: 1,
      },
      {
        instruction: "Sift flour",
        id: 2,
      },
      { instruction: "Add sugar to flour", id: 3 },
    ],
    notes: [
      { note: "Needs eggs", id: 1 },
      { note: "Could add vanilla", id: 2 },
      { note: "Add butter", id: 3 },
    ],
  },
];

module.exports = {
  db,
};
