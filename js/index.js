var Game = {

  /*============================================*\
                     OPTIONS
  \*============================================*/

  options: {
    startingTime: 10000, // the initial time given when starting the game (in ms)
    addedQuestionTime: 5000, // the time given for each correct answer (in ms)
    takenQuestionTime: 2500, // the time taken for each incorrect answer (in ms)
  },

  /*============================================*\
                    MAIN ENGINE
  \*============================================*/

  init: function() {

    this.currentQuestion = "";
    this.currentAnswer = 0;
    this.multiplier = 0;
    this.score = this.el.score.innerHTML = 0;

    this.assets = {};
    this.assets.questions = "assets/questions/";
    this.assets.images = "assets/images/";

    // load initial questions and initiate this.start as a callback to start the game
    this.loadQuestions(this.assets.questions+"questions.json", this.start, this);

    this.notify("Sėkmės žaidime!", true);

  },
  start: function() {
    // stop the timer before starting it again
    //this.timer().stop();
    this.timer().start(this.options.startingTime);
    this.el.time.className = "";
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
    this.el.score.innerHTML = 0;
    this.el.gameOver.className = "hidden";
    this.notify("Bandom dar kartą!", true);
    this.start();
  },
  gameOver: function() {
    this.timer().stop();
    this.el.gameOver.className = "";
    this.el.deathScore.innerHTML = "Surinkai "+this.score+"!";
    this.notify("Žaidimas baigtas :(");
    var that = this; // this is nasty
    this.el.playAgain.onclick = function() {
      that.restart();
    };
  },
  
  /*============================================*\
                      SCORE
  \*============================================*/

  addScore: function(howMuch) {
    var reward = this.multiplyScore(howMuch, this.multiplier),
        timeAdded = howMuch * this.options.addedQuestionTime,
        newTime = this.timeLeft + timeAdded;
    // add time as well as score
    this.timer().stop();
    this.timer().start(newTime);
    this.score += reward;
    this.notify("+"+reward+" & +"+this.timer().msToTime(timeAdded)+"!");
    this.printScore(this.score);
  },
  subtractScore: function(howMuch) {
    var punishment = this.divideScore(howMuch, this.multiplier),
        timeTaken = howMuch * this.options.takenQuestionTime,
        newTime = this.timeLeft - timeTaken;
    // add time as well as score
    this.timer().stop();
    this.timer().start(timeTaken);
    this.score -= punishment;
    this.notify("-"+punishment+" & -"+this.timer().msToTime(timeTaken)+" :(");
    this.printScore(this.score);
  },
  printScore: function(score) {
    this.el.score.innerHTML = score;
  },
  multiplyScore: function(score, multiplier) {
    return multiplier > 0 ? (this.score * multiplier) | 0 : score;
  },
  divideScore: function(score, multiplier) {
    return multiplier > 0 ? (this.score / multiplier) | 0 : score;
  },

  /*============================================*\
                      TIMING
  \*============================================*/

  timer: function() {

    var timeEl = this.el.time,
        gameOver = this.gameOver,
        self = this;

    var tock = new Tock({
      countdown: true,
      interval: 48,
      callback: function() {
        var timeLeft = tock.lap();
        timeEl.innerHTML = tock.msToTime(timeLeft);
        self.timeLeft = timeLeft;
      },
      complete: function() {
        timeEl.innerHTML = "LAIKAS!!!";
        Game.gameOver(); //not cool
      }
    });

    return tock;
  },



  /*============================================*\
                    QUESTIONS
  \*============================================*/

  generateQuestion: function(questions) {

    // generate question & populate answers

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

      // question has image, display it
      if(question.length === 4) {
        return this.el.question.innerHTML = '<img src="'+this.assets.images+question[3]+'" />'+question[0];
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
      
      // TODO: randomize answers order!
      
      //this.el.answers.appendChild(answers[Math.random() * i | 0]);
      this.el.answers.appendChild(answer);

      // add click listeners
      this.el.answers.children[i].answerId = i + 1; // not ++i
      this.el.answers.children[i].onclick = this.checkAnswer;
    }
  },
  checkAnswer: function(e) {
    // TODO: how can I pass the Game object without invoking it here?
    if(e.target.answerId === Game.currentAnswer) {
      return Game.correct();
    } else {
      return Game.inCorrect();
    }
  },
  correct: function() {
    this.addScore(1);
    this.generateQuestion(this.questions);
  },
  inCorrect: function() {
    this.subtractScore(1);
    if(this.timeLeft > 0) {
      this.generateQuestion(this.questions);
    } else {
      this.gameOver();
    }
  },
  switchQuestions: function(path) {
    this.questions = "";
    this.currentQuestion = "";
    this.currentAnswer = "";
    this.notify("Klausimai pakeisti!");
    this.loadQuestions(path, this.start, this);
  },
  loadQuestions: function(path, callback, callbackObj) {
    return this.fetchJSON(path, function(data) {
      if(typeof callback === "function") {
        callbackObj.questions = data.questions;
        callback.apply(callbackObj);
      }
    });
  },

  /*============================================*\
                      HELPERS
  \*============================================*/
  
  // Elements
  el: {
    "question": document.getElementById("question"),
    "answers": document.getElementById("answers"),
    "gameOver": document.getElementById("gameOver"),
    "playAgain": document.getElementById("playAgain"),
    "score": document.getElementById("score"),
    "deathScore": document.getElementById("deathScore"),
    "notifications": document.getElementById('notifications'),
    "time": document.getElementById('time'),
  },
  
  // Notify user by displaying a message
  notify: function(message, clear) {
    // clear notification area using Game.notify("message", true);
    if(clear) {
      this.el.notifications.innerHTML = "";
    }

    var messageEl = document.createElement('li');
    messageEl.innerHTML = message;
    this.el.notifications.insertBefore(messageEl, this.el.notifications.children[0]);
    //this.el.notifications.appendChild(messageEl);

    this.el.notifications.scrollTop = 0;
    
    if(this.el.notifications.children.length > 4) {
      this.el.notifications.removeChild(this.el.notifications.children[this.el.notifications.children.length -1]);
    }
    
  },
  getRandInRange: function(min, max) {
    return Math.random() * (max - min) + min | 0;
  },
  fetchJSON: function(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if(httpRequest.readyState === 4) {
        if(httpRequest.status === 200) {
          var data = JSON.parse(httpRequest.responseText);
          if(callback) callback(data);
        }
      }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
  }

};

window.onload = function() {
  Game.init();
};