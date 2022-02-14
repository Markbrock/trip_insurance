import json
from datetime import datetime
import uuid

def Validation(age):
    # - set initial validation to false
    validation = True
    
    
    # - checks if the age list are all numbers that are greater than 0
    for x in age:
        
        if int(x) <= 0:
            print("age needs to be a number greater than 0")
            validation = False
        
    # - check if first age is over 18
    if int(age[0]) < 18:
        print("first age needs to be 18 or over")
        validation = False
        
    return validation
    

def getDate(isodate):
    date = datetime.strptime(isodate, '%Y-%m-%d')
    return date
    
def quoteTotal(age,trip_length):
    
    fixed_rate = 3
    total = 0
    
    # - loop through given ages adding the sum to total
    for x in age:
        
        
        print("the fixed rate is: " , fixed_rate)
        print("the trip length is: " ,  trip_length)
        print("the age load for the person is: " ,  ageLoad(x))
        # -total calculation
        # -round() is used to prevent displaying floats
        total += round((fixed_rate * ageLoad(x) * trip_length),2)
       
        
    return '{:,.2f}'.format(total)
        
        
    

def ageLoad(age):
    age = int(age)
    # - Load for anyone under 18 is assumed to be 0
    load = 0
    if age >= 18 and age <= 30:
        load = 0.6
    elif age >= 31 and age <= 40:
        load = 0.7
    elif age >= 41 and age <= 50:
        load = 0.8
    elif age >= 51 and age <= 60:
        load = 0.9
    elif age >= 61 and age <= 70:
        load = 1
        
    return load
    
  
def tripLength(start_date,end_date):
    
    # -tripLength Calculation
    # -a day is added in calculation to include day of departure
    return ((getDate(end_date)-getDate(start_date)).days + 1)
    
  
def lambda_handler(event, context):
    

    # - import event parameters
    age = (event['age'])
    currency_id = (event['currency_id'])
    start_date = (event['start_date'])
    end_date = (event['end_date'])
    
    # - varify ages
    if Validation(age) == False:
        print("age validation failed")
    else:
        # - get trip_length 
        trip_length = tripLength(start_date,end_date)
        
        # - total calculation 
        quote_total = quoteTotal(age,trip_length)
        print("the Qouted Total is: ",quote_total,currency_id)
        
        # - create quotation_id
        # - using uuid to generate a unique id
        
        quotation_id = str(uuid.uuid4())
        
        return  {
           
            "total": quote_total,
            "currency_id": currency_id,
            "quotation_id": quotation_id
        }