var Game = {

  /*============================================*\
                     OPTIONS
  \*============================================*/

  options: {
    startingTime: 10000, // the initial time given when starting the game (in ms)
    addedQuestionTime: 5100, // the time given for each correct answer (in ms)
    takenQuestionTime: 2100, // the time taken for each incorrect answer (in ms)
  },

  /*============================================*\
                    MAIN ENGINE
  \*============================================*/

  init: function() {

    this.currentQuestion = "";
    this.currentAnswer = null;
    this.multiplier = 0;
    this.score = this.el.score.innerHTML = 0;
    this.level = 1;

    this.assets = {};
    this.assets.questions = "assets/questions/";
    this.assets.images = "assets/images/";
    
    this.el.startGame.onclick = this.mainMenu.bind(this);

  },
  mainMenu: function() {
    this.el.mainMenu.className = "hidden";
    // load initial questions and initiate this.start as a callback to start the game
    this.loadQuestions(this.assets.questions+"questions.json", this.start, this);

    this.notify("Važiuojam!", true);
  },
  start: function() {
    // stop the timer before starting it again
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
    this.currentAnswer = null;
    this.score = 0;
    this.el.score.innerHTML = 0;
    this.el.gameOver.className = "hidden";
    this.notify("Bandom dar kartą!", true);
    this.start();
  },
  gameOver: function() {
    this.timer().stop();
    this.el.answers.innerHTML = "";

    this.el.gameOver.className = "";
    this.el.deathScore.innerHTML = "Surinkai "+this.score+"!";
    var self = this; // this is nasty
    this.el.playAgain.onclick = function() {
      self.restart();
    };
  },
  checkLevel: function(direction) {
    if(this.score > 5) {
      if(this.score % 6 === 0) {
        if(direction) {
          this.level++;
          this.notify(this.level+" lygis!", "good");
        } else {
          this.level--;
          this.notify(this.level+" lygis :(", "bad");
        }
        this.el.level.innerHTML = this.level;
      }
    }
  },
  
  /*============================================*\
                      SCORE
  \*============================================*/

  addScore: function(howMuch) {
    var reward = this.multiplyScore(howMuch, this.multiplier),
        timeAdded = howMuch * this.options.addedQuestionTime - this.level * 200,
        newTime = this.timeLeft + timeAdded;
    if(timeAdded <= 0) timeAdded = 0;
    // add time as well as score
    this.timer().stop();
    this.timer().start(newTime);
    this.score += reward;
    this.notify("+"+reward+" & +"+this.timer().msToTime(timeAdded)+"!", "good");
    this.printScore(this.score);
  },
  subtractScore: function(howMuch) {
    var punishment = this.divideScore(howMuch, this.multiplier),
        timeTaken = howMuch * this.options.takenQuestionTime - this.level * 200,
        newTime = this.timeLeft - timeTaken;
    if(timeTaken <= 0) timeTaken = 0;
    // add time as well as score
    this.timer().stop();
    this.timer().start(newTime);
    this.score -= punishment;
    this.notify("-"+punishment+" & -"+this.timer().msToTime(timeTaken)+" :(", "bad");
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
        self = this; // nasty

    var tock = new Tock({
      countdown: true,
      interval: 48,
      callback: function() {
        var timeLeft = tock.lap();
        timeEl.innerHTML = tock.msToTime(timeLeft);
        self.timeLeft = timeLeft;
      },
      complete: function() {
        timeEl.innerHTML = "00:00.000";
        timeEl.className = "attention";
        self.gameOver();
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
          question = this.questions[random],
          image = '<img src="'+this.assets.images+question[3]+'" />';

      this.currentQuestion = question;

      // question has no image, add place holder
      if(question.length !== 4) {
        this.el.question.children[0].src = this.assets.images+'noImage.jpg';
      } else {
        this.el.question.children[0].src = this.assets.images+question[3];
      }
      this.el.question.children[1].innerText = question[0];
      
      // display answers in #answers
      this.populateAnswers(random, question[1], question[2]);

    } else {
      this.el.questionInnerHTML = "Nėra klausimų :(";
    }
  },
  populateAnswers: function(question, answers, correctAnswer) {

    // preserve correct answers' value so that it could be used later
    var preShuffledAnswer = answers[correctAnswer - 1];

    // shuffle the answers
    // TODO!!! FIX THIS!
    //var answers = answers.sort(function() { return 0.5 - Math.random() });

    this.currentAnswer = answers.indexOf(preShuffledAnswer) + 1;

    // remove previous answers
    this.el.answers.innerHTML = "";

    // add new answers in random order
    for (var i = 0; i < answers.length; i++) {
      var answer = document.createElement('li');
      answer.innerHTML = answers[i];

      this.el.answers.appendChild(answer);

      // add click listeners
      //this.el.answers.children[i].onclick = this.checkAnswer.bind(this, i);
      this.el.answers.children[i].addEventListener("click", this.checkAnswer.bind(this, i));
    }
  },
  checkAnswer: function(item) {
    if(item + 1 === this.currentAnswer) {
      return this.correct();
    } else {
      return this.inCorrect();
    }
  },
  correct: function() {
    this.addScore(1);
    this.checkLevel(true); // level goes up!
    this.generateQuestion(this.questions);
  },
  inCorrect: function() {
    this.subtractScore(1);
    if(this.timeLeft > 0) {
      this.checkLevel(); // level goes down :(
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
    'question': document.getElementById('question'),
    'answers': document.getElementById('answers'),
    'gameOver': document.getElementById('gameOver'),
    'playAgain': document.getElementById('playAgain'),
    'score': document.getElementById('score'),
    'deathScore': document.getElementById('deathScore'),
    'notifications': document.getElementById('notifications'),
    'time': document.getElementById('time'),
    'level': document.getElementById('level'),
    'mainMenu': document.getElementById('mainMenu'),
    'startGame': document.getElementById('startGame')
  },
  
  // Notify user by displaying a message
  notify: function(message, second) {

    var messageEl = document.createElement('li');
        messageEl.innerHTML = message,
        self = this; //again...

    // clear notification area using Game.notify("message", true);
    if(second === true) {
      this.el.notifications.innerHTML = "";
    } else if (second === "good") {
      messageEl.className = "good";
    } else if (second === "bad") {
      messageEl.className = "bad";
    }

    this.el.notifications.appendChild(messageEl);

    setTimeout(function() {
      messageEl.parentNode.removeChild(messageEl);
    },2000);
    
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