var Game = {
  questions: [
    ["Koks žirgelis čia rupšnoja žolelę?", ["Žemaičių riestasis", "Obuolmušis", "Bėras"], 2, "arklys.jpg"],
    ["Kas pavaizduota?", ["Obuolmušis", "Vytauto didžiojo malamutas", "Inga Valinskienė"], 1, "arklys.jpg"],
    ["Ar tai Rupšnotojas didysis?", ["Taip", "Ne", "Toks neegzistuoja"], 3, "arklys.jpg"]
  ],
  
  // Elements
  el: {
    "question": document.getElementById("question"),
    "answers": document.getElementById("answers"),
    "gameOver": document.getElementById("gameOver"),
    "playAgain": document.getElementById("playAgain"),
    "score": document.getElementById("score"),
    "deathScore": document.getElementById("deathScore")
  },
  init: function() {
    this.currentQuestion = "";
    this.currentAnswer = 0;
    this.score = 0;
    this.el.score.innerHTML = "0";
    
    this.assets = {};
    
    this.assets.images = "assets/images";
    
    this.start();
  },
  start: function() {
    if(this.currentQuestion === "") {
      // display the question and populate answers
      this.generateQuestion(this.questions);
           
    } else {
      this.el.question.innerHTML = "?";
    }
  },
  restart: function() {
    this.currentQuestion = "";
    this.currentAnswer = 0;
    this.score = 0;
    this.el.score.innerHTML = this.score;
    this.el.gameOver.style.display = "none";
    this.start();
  },
  generateQuestion: function(questions) {
    /* questions[question][0] - the question
       questions[question][1] - array of the the answers
       questions[question][2] - the correct answer (NOT array index, so do -1 for that)
       questions[question][3] - the image to go along with the question (optional)
    */
    
    if(questions.length > 0) {
      var random = this.getRandInRange(0, questions.length),
          question = this.questions[random];

      this.currentQuestion = question;
      // display answers in #answers
      this.populateAnswers(random, question[1], question[2]);

      if(question.length === 4) {
        return this.el.question.innerHTML = '<img src="'+this.assets.images+'/'+question[3]+'" />'+question[0];
        //return this.el.question.innerHTML = '<img src="'+question[5]+'" />'+question[0];
      }
      
      return this.el.question.innerHTML = question[0];
    } else {
      this.el.questionInnerHTML = "Nėra klausimų :(";
    }
  },
  populateAnswers: function(question, answers, correctAnswer) {
    this.currentAnswer = correctAnswer;
    
    // remove previous answers
    this.el.answers.innerHTML = "";
    
    // add new answers in random order
    for (var i = 0; i < answers.length; i++) {
      var answer = document.createElement('li');
      answer.innerHTML = answers[i];
      //answer.id = "answer"+i;
      
      // TODO: randomize answers order!
      
      //this.el.answers.appendChild(answers[Math.random() * i | 0]);
      this.el.answers.appendChild(answer);

      // add click listeners
      this.el.answers.children[i].answerId = i + 1; // not ++i
      this.el.answers.children[i].onclick = this.checkAnswer;
      //this.el.answers.children[i].addEventListener("click", this.checkAnswer, false);

    }
  },
  checkAnswer: function(e) {
    // TODO: how can I pass the Game object without invoking it here?
    if(e.target.answerId === Game.currentAnswer) {
      return Game.correct(this.id);
    } else {
      return Game.inCorrect(this.id);
    }
  },
  correct: function() {
    this.el.score.innerHTML = ++this.score;
    this.generateQuestion(this.questions);
  },
  inCorrect: function() {
    this.el.gameOver.style.display = "block";
    this.el.deathScore.innerHTML = "Viso atspėjai "+this.score;
    this.el.playAgain.onclick = function() {
      Game.restart();
    };
  },
  
  // Helper functions
  getRandInRange: function(min, max) {
    return Math.random() * (max - min) + min | 0;
  }

};

window.onload = function() {
  Game.init();
};