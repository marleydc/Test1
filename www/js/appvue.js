const app = new Vue({
    el: '#app',
    data: {
        words: [],
        allWords: [],
        maxWords: 6,
        startCounter: 25,
        Score: 0,
        Vocabulary : 8,
        items : {}
    },
    created() {
        var wordlib = localStorage.getItem("wordlib");
        var wordlibParsed = JSON.parse(wordlib);
        this.allWords = wordlibParsed; 

        this.populateInitialWords();
    },
    mounted() {
        initDragDrop();

        // Start the timer
        window.setInterval(() => {
            this.updateCounters();
        }, 1000);
        
        /*
        var self = this;
        $.ajax({
            url: 'https://node22.codenvy.io:38128/wordphrase',
            method: 'GET',
            success: function (data) {
                self.items = data;
            },
            error: function (error) {
                console.log(error);
            }
        });
        */
    },
    computed: {
        // a computed getter
        maxReached : function () {
            if (this.Vocabulary >= this.allWords.length)
                return true;
             else
                return false;
        },
        // a computed getter
        latestWord : function () {
            return this.allWords[this.Vocabulary - 1];
        }
    },
    methods: {
        Restart: function() {
            this.Vocabulary = 8;
            this.Score = 0;
            this.words.length = 0;  
            this.populateInitialWords();
        },
        populateInitialWords: function(event) {
            if (this.Vocabulary < this.maxWords)
                return;
            
            this.words.length = 0;                
            var initialWordList = [];

            // Build up array of random words 
            var wordCount = 0;
            for (;;) {
                var randomItem = this.allWords[Math.floor(Math.random() * this.Vocabulary)];

                if (initialWordList.indexOf(randomItem) < 0) {
                    initialWordList.push(randomItem);
                    wordCount++;
                    if (wordCount >= this.maxWords) {
                        break;
                    }
                }
            }
            
            var sourceWords = [];
            var targetWords = [];
            
            // Build up array of words 
            var wordCount = 0;
            for (var wordNum = 0; wordNum < initialWordList.length; wordNum++) {
                var currentWord = initialWordList[wordNum];
                
                // Create 2 new words from each side
                var word1 = {};
                word1.wordType = "source";
                word1.language1 = currentWord.language1;
                word1.language2 = currentWord.language2;
                word1.level = currentWord.level;
                word1.done = false;
                word1.counter = this.startCounter;

                sourceWords.push(word1);

                var word2 = {};
                word2.wordType = "target";
                word2.language1 = currentWord.language2;
                word2.language2 = currentWord.language1;
                word2.level = currentWord.level;
                word2.done = false;
                word2.counter = this.startCounter;

                targetWords.push(word2);
            }
            
            // Shuffle the word arrays
            this.shuffle(sourceWords);
            this.shuffle(targetWords);
            
            // Add all words to words array
            for (var wordNum = 0; wordNum < targetWords.length; wordNum++) {
                var currentWord = targetWords[wordNum];
                this.words.push(currentWord);
            }
            
            // Add all words to words array
            for (var wordNum = 0; wordNum < sourceWords.length; wordNum++) {
                var currentWord = sourceWords[wordNum];
                this.words.push(currentWord);
            }
        },
        shuffle : function(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        },
        IncrementScore: function() {
            this.Score ++;
            if (this.Score >= 5){ 
                this.Score = 0;

                if (this.Vocabulary < this.allWords.length)
                    this.Vocabulary ++;
            }
        },
        DecrementScore: function(amount) {
            this.Score -= amount;

            if (this.Score <= -5){
                this.Score = 0;

                this.Vocabulary --;
            }
        },
        ApplyMatch: function(level) {
            this.IncrementScore();
            for (var wordNum = 0; wordNum < this.words.length; wordNum++) {
                var currentWord = this.words[wordNum];
 
                if (currentWord.level == level) {
                    currentWord.counter = 0;
                    currentWord.done = true;
                    currentWord.matched = true;
                }
            }
            this.CheckDone();
        },
        ApplyMisMatch: function(language1, level) {
            navigator.vibrate(50);
            this.DecrementScore(1);
            /*
            for (var wordNum = 0; wordNum < this.words.length; wordNum++) {
                var currentWord = this.words[wordNum];
 
                if ((currentWord.level == level & ()) {
                    currentWord.counter = 0;
                    currentWord.done = true;
                    currentWord.matched = false;
                }
            }*/
            this.CheckDone();
        },
        CheckDone: function(level) {
            var doneCount = 0;
            for (var wordNum = 0; wordNum < this.words.length; wordNum++) {
                var currentWord = this.words[wordNum];

                if (currentWord.done == true)
                    doneCount++;
            }

            //If all words are now zero
            if (doneCount >= this.maxWords * 2)
               this.populateInitialWords();
        },
        updateCounters: function(event) {
            for (var wordNum = 0; wordNum < this.words.length; wordNum++) {
                var currentWord = this.words[wordNum];

                if (currentWord.counter > 0){
                    currentWord.counter--;

                    // Check if we have missed this word
                    if (currentWord.counter == 0){
                        if (currentWord.done == false){
                            this.DecrementScore(0.5);
                            navigator.vibrate(200);
                        }
                    }
                }
                else {
                    currentWord.done = true;
                }
            }
            this.CheckDone();
        },
        getBGColor: function(done) {
            if (done)
            {
                return "white";
            }
            else
            {
                return "#33CCFF"; 
            }

                
        },
        getBGImage: function(word) {
            var urlImage = "";
            // 'url(images/' + word.language1 + '.jpg)'
            if ((word.wordType=='source') & (!word.done))
                urlImage = "url('images/" + word.language1 + ".jpg')";
            //console.log(urlImage);
            return urlImage;    
        },
        getColor: function(level, matched, done) {
            if (done)
            {
                if (matched) 
                    return "green";
                else
                    return "red";
            }
            else
            {
                if (level > 22)
                     return "#67FF33";
                else if (level > 18)
                    return "#33CCFF";
                else if (level > 14) 
                    return "#33BAFF";
                else if (level > 10)
                    return "#33FFF6";
                else if (level > 6)
                    return "#FF9333";
                else if (level > 2)
                    return "#FF33C7";
                else 
                    return "red";
            }
        },
        PopulateNewWord: function(event) {
            // Choose a random word
            var currentWord = this.allWords[Math.floor(Math.random() * this.allWords.length)];

            var word1 = {};
            word1.wordType = "source";
            word1.language1 = currentWord.language1;
            word1.language2 = currentWord.language2;
            word1.level = currentWord.level;
            word1.counter = this.startCounter;

            singleWords.push(word1);

            var word2 = {};
            word2.wordType = "target";
            word2.language1 = currentWord.language2;
            word2.language2 = currentWord.language1;
            word2.level = currentWord.level;
            word2.counter = this.startCounter;

            singleWords.push(word2);

            // Swap the two words with this level
            var isFirstWord = true;
            for (var wordNum = 0; wordNum < this.maxWords; wordNum++) {
                if (this.words[wordNum].level = currentWord.level) {
                    if (isFirstWord) {
                        this.words[wordNum] = word1;
                        isFirstWord = false;
                    } else
                        this.words[wordNum] = word2;
                }
            }

        },
    }
});