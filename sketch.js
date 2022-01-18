// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ML5 Example
Interactive LSTM Text Generation Example using p5.js
This uses a pre-trained model on a corpus of Virginia Woolf
For more models see: https://github.com/ml5js/ml5-data-and-training/tree/master/models/charRNN
=== */

let charRNN;
let loadStatus;
let textInput;
let tempSlider;
let textLength;
let runningInference = false;
let modelSelection;

let lengthText;
let temperatureText;

let originalText;
let predictionText;

function setup() {

  // Grab the DOM elements
  textInput = document.querySelector('#textInput');
  textLength = document.querySelector('#textLength');
  tempSlider = document.querySelector('#tempSlider');
  loadStatus = document.querySelector('#loadStatus');
  generateStatus = document.querySelector('#generateStatus');
  lengthText = document.querySelector('#length');
  temperatureText = document.querySelector('#temperature');
  originalText = document.querySelector('#original');
  predictionText = document.querySelector('#prediction');

  modelSelection = document.querySelector('#modelSelection');

  generateButton = document.querySelector('#generateButton');

  console.log(textInput);

  // Run generate anytime something changes
  modelSelection.addEventListener('change', loadModel);
  generateButton.onclick = generate;
  tempSlider.addEventListener('change', updateTemp);

  console.log(generateButton);

}

setup();

function loadModel() {
  // Create the LSTM Generator passing it the model directory
  loadStatus.innerHTML = 'Loading Model';
  charRNN = ml5.charRNN('models/' + modelSelection.value + '/', modelReady);
}

function ResetUI(){
  
}

function modelReady() {
  loadStatus.innerHTML = 'Model Loaded';
}

function updateTemp(){

  temperatureText.innerHTML = tempSlider.value;

}

function generate() {

  // prevent starting inference if we've already started another instance
  // TODO: is there better JS way of doing this?
 if(!runningInference) {
   runningInference = true;

    // Update the loadStatus log
    generateStatus.innerHTML = 'Generating...';

    // Update the length and temperature span elements
    // lengthText.innerHTML = textLength.value;
    

    // Grab the original text
    let original = textInput.value;
    // Make it to lower case
    let txt = original.toLowerCase();

    // Check if there's something
    if (txt.length > 0) {
      // Here is the data for the LSTM generator
      let data = {
        seed: txt,
        temperature: tempSlider.value,
        length: textLength.value
      };

      // Generate text with the charRNN
      charRNN.generate(data, gotData);

      // Update the DOM elements with typed and generated text
      function gotData(err, result) {
        generateStatus.innerHTML = 'Ready!';
        originalText.innerHTML = original;
        predictionText.innerHTML = result.sample;
        runningInference = false;
      }
    } else {
      // Clear everything
      originalText.innerHTML = '';
        predictionText.innerHTML = '';
    }
  }
}