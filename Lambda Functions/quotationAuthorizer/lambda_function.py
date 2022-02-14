import json
import boto3
import urllib3

secret_name = "QuoteAuthorizationToken"
region = "us-east-1"
# - Get api key from secret manager
def get_secret():
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region)
        
    get_secret_value_response = client.get_secret_value(
        SecretId=secret_name)
        
    secret_response = get_secret_value_response['SecretString']
    
    return json.loads(secret_response)

def lambda_handler(event, context):
    
    # - Log Authorization attempt
    print(event)
    # - retrieve secret key
    api_key = get_secret()
    # - authorization
    auth = 'Deny'
    if event['authorizationToken'] == api_key['authorizationToken']:
        auth = 'Allow'
    else: 
        auth = 'Deny'
    # - return policy
    return {
    "policyDocument":{
        "Version":"2012-10-17",
        "Statement":[
            {
                "Action":"execute-api:Invoke",
                "Resource":[
                    "arn:aws:execute-api:us-east-1:038200886882:2ndpt95a3e/*/*"

                    ],
                    "Effect":  auth
            }
            ]
            
    }
}

