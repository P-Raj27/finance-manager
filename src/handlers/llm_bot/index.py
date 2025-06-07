import json
import os
import dspy
from typing import Literal
import requests


url = "https://dk9kf4326l.execute-api.us-east-1.amazonaws.com/dev/"

apis = {
    "create_records": url + "create",
    "delete_records": url + "delete",
    "get_records": url + "read",
    "update_records": url + "update",
    "sync_records": url + "sync"
}


def fetch_api_response(url, method="POST", data=None):
    try:
        # Choose the appropriate HTTP method
        if method == "GET":
            response = requests.get(url, headers={"x-api-key": os.getenv("API_KEY")})
        elif method == "POST":
            response = requests.post(url, json=data, headers={"x-api-key": os.getenv("API_KEY")})  # sending JSON data in the body
        elif method == "PUT":
            response = requests.put(url, json=data, headers={"x-api-key": os.getenv("API_KEY")})  # sending JSON data in the body
        elif method == "DELETE":
            response = requests.delete(url, headers={"x-api-key": os.getenv("API_KEY")})
        else:
            return "Error: Unsupported HTTP method"

        # Check if the request was successful
        if response.status_code == 200 or response.status_code == 201:
            return response.json()  # Return the response as JSON
        else:
            return f"Error: Received status code {response.status_code}"
    except Exception as e:
        return f"Error: {e}"
    

class FetchRecordsData(dspy.Signature):
    "Based on the user query ,your job is to fetch the appropriate data by calling the right function and in the response you have to tell the next steps if any based on the User query"

    user_query = dspy.InputField()
    # email = "pratikraj276@gmail.com"
    raw_data = dspy.OutputField(desc="Raw JSON data of the record which is present in the \"data\" attribute returned from the last tool called, before any manipulation")
    is_next_step: bool = dspy.OutputField(desc="Return true if you think there is more steps to perform else return False")
    next_steps = dspy.OutputField(desc="Return the next steps as an Instruction which will be given to another LLMS if you thing there need to be done more that just fetching the data or else just return Null")
    
    response = dspy.OutputField(desc="Read the record properly and answer the user's query")


def get_total_investment_record(email):
    url = apis["get_records"]
    data = {
        "email": email,
        "investment_type": "Mutual_Fund",
        "type": "get_all_investment_summary",
        "investment_type": "Mutual_Fund"
    }
    response = fetch_api_response(url, method="POST", data=data)
    print("response", response)
    return response


def get_all_investment_records(email):
    url = apis["get_records"]
    data = {
        "email": email,
        "type": "get_user_investments"
    }
    response = fetch_api_response(url, method="POST", data=data)
    print("response", response)
    return response


def get_summarized_investment_record(email,investment_type):
    url = apis["get_records"]
    data = {
        "email": email,
        "investmentType": investment_type,
        "type": "get_investment_summary"
    }
    response = fetch_api_response(url, method="POST", data=data)
    print("response", response)
    return response


def chat_with_bot(user_query,email):

    '''
    User Query:
    "What is the total investment in Mutual Funds(SIP)?"

    Response:
    "The total investment in Mutual Funds(SIP) is 100000"
    
    '''

    total_investment_record_summary = dspy.Tool(
    func=lambda: (get_total_investment_record(email=email)),
    desc="This tool will fetch the summary of all Investments details at once,Call this when user is asking for profit or loss",
    )

    all_investment_records = dspy.Tool(
        func=lambda: (get_all_investment_records(email=email)),
        desc="This tool will fetch all the individual records details of the users",
        )

    summarized_investment_record = dspy.Tool(
        func=lambda investment_type: get_summarized_investment_record(
            email=email, investment_type=investment_type
        ),
        name="summarized_investment_record",
        desc="This tool will fetch the record summary based on the type of investment like Mutual Funds(SIP), Crypto Currency",
        arg_types={"investment_type": Literal["Mutual Funds(SIP)", "Mutual Funds(LumSum)","Crypto Currency","Banking(Savings)","Banking(FD)","Banking(RD)","ESOP","Tax Saver(ELSS)"]}
)

    lm = dspy.LM('bedrock/anthropic.claude-3-5-sonnet-20240620-v1:0')
    dspy.configure(lm=lm)

    react = dspy.ReAct(FetchRecordsData, tools=[total_investment_record_summary,all_investment_records,summarized_investment_record], max_iters=12)
    agent_response = react(user_query=user_query)

    print(agent_response)
    return agent_response.response

def handler(event, context):


    body = event.get("body")
    body = json.loads(body)
    user_query = body.get("user_query")
    email = body.get("email")

    if not user_query or not email:
        return {
            "statusCode": 400,
            "body": "User query and email are required"
        }

    response = chat_with_bot(user_query,email)

    return {
        "statusCode": 200,
        "body": response
    }