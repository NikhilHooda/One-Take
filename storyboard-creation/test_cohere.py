import os
from dotenv import load_dotenv
import cohere

load_dotenv()

api_key = os.getenv("COHERE_API_KEY")
print(f"API Key present: {bool(api_key)}")
print(f"API Key length: {len(api_key) if api_key else 0}")

if not api_key:
    print("ERROR: No API key found")
    exit(1)

try:
    co = cohere.Client(api_key)
    print("Cohere client created successfully")
    
    response = co.generate(
        model="command-r-plus",
        prompt="Hello, please respond with just the word 'test'",
        max_tokens=10,
        temperature=0.1
    )
    
    print(f"Response type: {type(response)}")
    print(f"Response: {response}")
    
    if hasattr(response, 'generations') and response.generations:
        generation = response.generations[0]
        print(f"Generation: {generation}")
        if hasattr(generation, 'text'):
            print(f"Text: {generation.text}")
        else:
            print("No text attribute found")
    else:
        print("No generations found")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
