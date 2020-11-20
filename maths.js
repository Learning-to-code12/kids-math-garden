var answer;
var score = 0;
var backgroundImages = [];

function nextQuestion() {
  const n1 = Math.floor(Math.random() * 5);
  document.getElementById('n1').innerHTML = n1;
  const n2 = Math.floor(Math.random() * 6);
  document.getElementById('n2').innerHTML = n2;

  answer = n1 + n2;
}

function checkAnswer() {

  const prediction = predictImage();
  console.log(`answer: ${answer}, prediction: ${prediction}`);

   if (prediction == answer) {
     score++;
     if (score <= 6) {
       backgroundImages.push(`url('images/background${score}.svg')`)
       document.body.style.backgroundImage = backgroundImages;

     }
     else {
       alert('Congratulations!!! your math garden is complete! want to start again?');
       score = 0;
       backgroundImages = [];
       document.body.style.backgroundImage = backgroundImages;

     }


     console.log(`correct score ${score}`);


   } else {
     if (score != 0) {
       score--;
       alert('Oops! Check your answer again and try writing the number neater the next time!');
       setTimeout(function () {
         backgroundImages.pop();
         document.body.style.backgroundImage = backgroundImages;
       }, 1000);
     }

     console.log(`Try again ${score}`);
   }
}
