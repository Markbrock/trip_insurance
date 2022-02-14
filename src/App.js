import { useState } from 'react';
import './App.css';

function App() {
  
  const [age,setAge] = useState([])
  const [newAge,setNewAge] = useState()
  const [currency_id,setCurrency_id] = useState('USD')
  const [start_date,setStart_date] = useState('')
  const [end_date,setEnd_date] = useState('')
  const [quote,setQuote] = useState('')
  
/**
 * addAge function
 * used to add an age to array and validate the
 * first age is not under 18 and the other ages are not 0 or blank
 */
  function addAge(event){
    event.preventDefault()
    document.getElementById("newAge").value = ''
    setNewAge('')
    if (newAge > 0 ){
        if(age.length === 0 && newAge < 18){
          alert("First Age must be 18 or over")
          }else{
            setAge([...age, newAge])
          }
    }else{
          alert("age must be greater than 0")
          
        }     
  }
/**
 * postData() used to call a fetch post method
 * authorizationToken is used to access the api
 */
  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'authorizationToken': process.env.REACT_APP_LAMBDA_QUOTE_KEY
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

/**
 * fetchQuote()
 * used to call postData() and format request data
 * 
 */
  function fetchQuote(event){
    event.preventDefault()
    postData('https://2ndpt95a3e.execute-api.us-east-1.amazonaws.com/test/quotation', { age: age,
    currency_id: currency_id,
    start_date: start_date,
    end_date: end_date })
  .then(data => {
    setQuote(data) // JSON data parsed by `data.json()` call
  });
    
   
  }

  

  return (
    <div className="App">
       {/**
        * a seperate form is used to add ages the the array
        * 
        */}
      <form onSubmit={addAge}>

            
            {
            /**
            * mapping ages
            * 
            */
            age.map((object,x) => (<div key={x}>age of person {x+1} is {age[x]}</div>))}
            <input onChange={event => setNewAge(event.target.value)} id='newAge' type="number" placeholder="age" ></input>
            <br/>
            <button  type="submit">Add age</button>
        </form>


      <form onSubmit={fetchQuote}>
            <select onChange={event => setCurrency_id(event.target.value)} id="currency" defaultValue="USD" name="currency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <br/>
            <input onChange={event => setStart_date(event.target.value)} type="date" id="start_date" name="start_date"
            
            min="2022-01-01" max="2025-12-31"></input>
            <br/>
            <input onChange={event => setEnd_date(event.target.value)} type="date" id="end_date" name="end_date"
            //setting min to start_date ensures the end_date is after start_date
            min={start_date} max="2025-12-31"></input>
            <br/>
            <button  type="submit">Get Quote</button>
        </form>
        <div>unique quotation id is {quote.quotation_id}</div>
        <div>total cost for the trip is {quote.total} {quote.currency_id}</div>
        
        
    </div>
  );
}

export default App;
