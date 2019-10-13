<template>
  <div class="questionCard">
    <div>
      <h1 class="title">{{ question.number }}</h1>
      <br>
      <h2>Enter Input</h2>
      <br>
      <div v-if="question.number == 'Final Question'" class="columns is-centered">
        <div class="column">
          <input class="inputField" type="text" v-model="finalInput.inputValue1" :placeholder="question.instruction">
        </div>
        <div class="column">
          <input class="inputField" type="text" v-model="finalInput.inputValue2" :placeholder="question.instruction">
        </div>
        <div class="column">
          <input class="inputField" type="text" v-model="finalInput.inputValue3" :placeholder="question.instruction">
        </div>
        <br>
      </div>
      <input v-else class="inputField" type="text" v-model="inputValue" :placeholder="question.instruction">
      <br>
      <br>
      <h2>Output : {{outputValue}}</h2>
      <br>
      <br>
      <br>
      <Button text="Get Output" @click.native="getOutput" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
export default {
  name: 'QuestionCard',
  data: function(){
    return {
      inputValue: "",
      finalInput : {
        inputValue1 : '',
        inputValue2 : '',
        inputValue3 : ''
      },
      outputValue:""
    }
  },
  components: {
    Button
  },
  props: {
    question:{
      number:String,
      instruction:String
    }
  },
  methods:{
   outputFunction1() {
     console.log("1")
      //Level 1 Question 1: single digit representation of a positive number
      let n = this.inputValue;
      if (isNaN(n) == false && parseInt(n)>=0) {
        let s = n + "";
        while (s.length > 1) {
          let sum = 0;
          for (let i = 0; i < s.length; i++) {
            sum += parseInt(s[i]);
          }
          s = sum + "";
        }
        return s;
      } else {
        return "Enter a valid number";
      }
    },
    outputFunction2() {
      console.log("2")
      //Level  1 Question 2: concatenation of powers of the number based on index ie 1234=12916;
      let n = this.inputValue;
      if (isNaN(n) == false && parseInt(n)<1000 && parseInt(n)>=0) {
        let answer = "";
        let s = n + "";
        for (let i = 0; i < s.length; i++) {
          answer += Number(parseInt(s[i]) ** (i + 1)).toString();
        }
        return answer;
      } else {
        return "Enter a valid number between 0 and 1000";
      }
    },
    outputFunction3() {
      console.log("3")
      //Level 1 Question 3 : count the number of occurances of the character in the string and display 
      let a = this.inputValue;
      if (isNaN(a) && /^[a-zA-Z]+$/.test(a)) {   
        let my_dict = {};
        let s = a;
        let ans = "";
        for (let i = 0; i < s.length; i++) {
          if (my_dict[s[i]] == undefined) {
            my_dict[s[i]] = 1;
          } else {
            my_dict[s[i]] += 1;
          }
        }
        let keys = Object.keys(my_dict);
        for (let i of keys) {
          ans += my_dict[i];
        }
        return ans;
      } else {
        return "Enter a string";
      }
    },
    outputFunction4(){
      console.log("4")
      //Level 2 Question 1: sum of divisors of number entered
      let n = this.inputValue 
      if (isNaN(n) == false && parseInt(n)<=1000 && parseInt(n)>=0) {
        let sum = 0;
        for (let i = 1; i <= n; i++) {
            if (n % i == 0) {
                sum += i;
            }
        }
        return (sum);
    }
    else {
        return ("Enter a valid number between 0 and 1000");
    }
    },
    outputFunction5(){
      console.log("5")
      //Level 2 Question 2: Shifting cipher ; shifts letter according to (-1**index)*(i+1)
      let v;
      let a = this.inputValue
      if (isNaN(a) && /^[a-zA-Z]+$/.test(a)) {
        let pos_a = "A".charCodeAt(0);
        let pos_z = "Z".charCodeAt(0);
        let word = a.toUpperCase();
        let ans = "";
        for (let i = 0; i < word.length; i++) {
            v = word[i].charCodeAt(0) + ((-1) ** i) * (i + 1);
            if (v > pos_z) {
                v = v % pos_z + pos_a - 1;
                ans += String.fromCharCode(v);
            }
            else if (v < pos_a) {
                v = pos_z - (pos_a - v) + 1;
                ans += String.fromCharCode(v);
            }
            else {
                ans += String.fromCharCode(v);
            }
        }
        return (ans);
    }
    else {
        return ("Enter a valid string");
    }
    },
    outputFunction6(){
      console.log("6")
      //Final Question : Level 3 : return XOR of three inputs 
      let a = this.finalInput.inputValue1
      let b = this.finalInput.inputValue2
      let c = this.finalInput.inputValue3
      //CODE FOR QUESTION 6
      if(!isNaN(a) && !isNaN(b) && !isNaN(c)){

        if(parseInt(a)<=10000 && parseInt(b)<=10000 && parseInt(c)<=10000 && parseInt(a)>=0 && parseInt(b)>=0 && parseInt(c)>=0){
          return(parseInt(a)^parseInt(b)^parseInt(c))
        }
        else{
          return("Enter valid numbers between 0 and 10000")  
        }
      }
      else{
        return("Enter valid numbers between 0 and 10000")
      }
    },
    getOutput(){
      if(this.question.number == "Question 1")
        this.outputValue = this.outputFunction1()
      else if(this.question.number == "Question 2")
        this.outputValue = this.outputFunction2()
      else if(this.question.number == "Question 3")
        this.outputValue = this.outputFunction3()
      else if(this.question.number == "Question 4")
        this.outputValue = this.outputFunction4()
      else if(this.question.number == "Question 5")
        this.outputValue = this.outputFunction5()
      else if(this.question.number == "Final Question")
        this.outputValue = this.outputFunction6()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.questionCard{
  text-align: center;
  padding: 50px;
  color: white;
  background: #1d1d1d;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
.inputField{
  padding: 20px;
  font-size: 110%;
  background: #1d1d1d;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 2px #A32A29 solid;
  color: whitesmoke;
  width: 100%;
}
.button{
  border: none;
}
.title{
    padding: 30px;
    background: #1d1d1d;
    width: 100%;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    color: whitesmoke;
}

</style>
