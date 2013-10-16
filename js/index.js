var Game = {
  questions: [
    ["Kur namų raktai?", "Rankoj, asile", "Pamečiau", "Neturiu namų", 2, "http://placekitten.com/200/300"],
    ["Ar už tokią Lietuvą kovojom?", "NE!", "NE!", "NE!", 2, "http://placekitten.com/240/350"],
    ["Ar pienas baltas?", "Taip", "Ne", "Nežinau", 1, "http://placekitten.com/280/230"],
    ["Ką geria karvė?", "Pieną", "Alų", "Brendį", 1, "http://placekitten.com/340/230"]
  ],
  
  // Elements
  el: {
    "question": document.getElementById("question"),
    "answers": document.getElementById("answers"),
    "answerOne": document.getElementById("answerOne"),
    "answerTwo": document.getElementById("answerTwo"),
    "answerThree": document.getElementById("answerThree"),
    "gameOver": document.getElementById("gameOver"),
    "playAgain": document.getElementById("playAgain"),
    "score": document.getElementById("score")
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
    this.el.gameOver.style.display = "none";
    this.start();
  },
  generateQuestion: function(questions) {
    /* questions[question][0] - the question
       questions[question][1] - the first answer
       questions[question][2] - the second answer
       questions[question][3] - the third answer
       questions[question][4] - the correct answer (number 1, 2 or 3)
       questions[question][5] - the image to go along with the question (optional)
    */
    
    if(questions.length > 0) {
      var random = this.getRandInRange(0, questions.length),
          question = this.questions[random];
      
      this.currentQuestion = question;
      this.populateAnswers(random, this.questions[random][4]);
      
      if(question.length === 6) {
        //return this.el.question.innerHTML = '<img src="'+this.assets.images+'/'+question[5]+'" />'+question[0];
        return this.el.question.innerHTML = '<img src="'+question[5]+'" />'+question[0];
      }
      
      return this.el.question.innerHTML = question[0];
    } else {
      this.el.questionInnerHTML = "Nėra klausimų :(";
    }
  },
  populateAnswers: function(question, answer) {
    this.currentAnswer = answer;
    this.el.answerOne.innerHTML = this.questions[question][1];
    this.el.answerTwo.innerHTML = this.questions[question][2];
    this.el.answerThree.innerHTML = this.questions[question][3];
    // mix it all up
    for (var i = this.el.answers.children.length; i >= 0; i--) {
      this.el.answers.appendChild(this.el.answers.children[Math.random() * i | 0]);
    }
  },
  checkAnswer: function() {
    // this is not good, better fix it
    var currentAnswer = Game.currentAnswer;
    if (this.id === "answerOne" && currentAnswer === 1) {
      return Game.correct(this.id);
    } else if (this.id === "answerTwo" && currentAnswer === 2) {
      return Game.correct(this.id);
    } else if (this.id === "answerThree" && currentAnswer === 3) {
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
  
  // listen to answers being clicked and check if it's correct
  Game.el.answerOne.addEventListener("click", Game.checkAnswer, false);
  Game.el.answerTwo.addEventListener("click", Game.checkAnswer, false);
  Game.el.answerThree.addEventListener("click", Game.checkAnswer, false);
  
  
  Game.init();
};