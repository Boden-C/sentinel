from flask import json

FIRST_PROMPT = """DO NOT USE CODE TO ANALYZE, USE NATURAL LANGUAGE PROCESSING
Please think over what you say to see if it makes sense and if it's easy for the client to understand. 

Input: I have this JSON file with client data, based on this, write actions you will do with the client that can make to optimize energy usage in their home and potentially save money.  

Calculation: Think it thoroughly through. At all times, consider all context given, including the current time at that location, the location itself, current weather, future forecasts. Use this context to make further inferences and advanced deductions that are not provided. Finally, use all possible relevant context and your own calculations in your responses. Then, think about logical human behavior, and expected scientific behavior during those context. Do not aim for a hard-coded targets, use the context to determine the most optimized target, as long as the targets is within acceptable limits (65 to 75 F). 

Output: Using all this information, create a detailed action plan to act out to save energy costs that includes all information needed to make a theoretical API request. Do not make vague general requests, specifically mention the appliance or room, the time, and all other necessary information. All actions should be done by the AI through pure software api requests, it should NOT require software, hardware, or manual intervention. The action should be a possible and understandable with no negative consequences, such as no turning off the refrigerator as it would cause food to spoil.
Output in this JSON format
{
   estimatedCarbonEmmissions: (low, medium, or high)
   estimatedEnergyUse: number
   estimatedEnergyUsage: string
   actions: [
       {
        title: it should be less than 6 words 
        description: few sentences that should emphasize the current context. Use the templates similar to "in/currently ___ there is ____ therefore it is suggested ___" or "due to ____ it is suggested ____". Make sure clear context and future thinking skills are displayed.
        impact: make sure that it is short and don't make it complex, but give it in a statistical format if you can. Emphasize on the money part and how they are contributing to making the world a better place when they do that action.
        actionCode: string
       }
   ]
}

Examples: 
If it is night time, nobody would be using the kitchen until 8:00 in the morning. I will turn off HVAC and start it up at 7:30am
There is forecasts of high wind, the fan uses 400kwh of energy usage.  will open the window to utilize the breeze until the rainstorm in 3 hours
Based on past data, there is nobody expected in the weekends. I will turn off all appliances until next monday.

Tone: Be a professional and smart assistant that shows off all evidence like a detective.

Generate 20 responses"""

SECOND_PROMPT = """I'll give you a JSON list of estimatedCarbonEmmissions, estimatedEnergyUse, estimatedEnergyUseUnit and actions. Output the JSON but only choose the actions that include the most context and accurately applies the context to demonstrate complex logical forward thinking skills of forecasting, human behavior, and expectations. Do not choose duplicates, inaccurate, or recommendations that cause worse energy usage. All actions should be done by the AI through pure software api requests, it should NOT require software, hardware, or manual intervention. The action should be a possible and understandable with no negative consequences, such as no turning off the refrigerator as it would cause food to spoil. Output in JSON only, do not add external text."""

def parseGeneratedResponseForJson(response:str) -> dict:
    """
    Parse the response from the generated data API endpoint.
    
    Args:
        response: The response from the generated data API endpoint.
    
    Returns:
        A dictionary containing the parsed response.
    """
    # Check until start of JSON
    start_index = response.index('{')
    # Check until end of JSON
    end_index = response.rindex('}') + 1
    # Extract the JSON
    json_response = response[start_index:end_index]
    # Parse the JSON
    try:
        parsed_response = json.loads(json_response)
    except:
        raise Exception('AI did not include valid JSON')
    
    # Return the parsed response
    return parsed_response 