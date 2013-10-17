# Arklidės

A simple quiz engine written in JavaScript.

A friend of mine needed this.

## Features

1. questions with any amount of answers
2. questions might display images
3. player score
4. frenzy mode (multiplied scores when conditions are met)

## Adding more questions

Add your own questions to `Game.questions` array like so:

    [
      "What is the answer to everything?", // The question
      ["'80s", "69", "42"], // an array of answers. Can be whatever amount of options
      3, // integer illustrating the correct answer (note: NOT the index of an array, so it starts from 1!)
      "image.jpg" // an image to display with the question (optional). Images should be hosted at /assets/images
    ]

Without the comments:

    ["What is the answer to everything?", ["'80s", "69", "42"], 3, "image.jpg"],
    ["Another tricky question", ["Answer 1", "Answer 2", "Answer 3", "Answer 4"], 3, "anotherImage.jpg"],

---

Currently in development