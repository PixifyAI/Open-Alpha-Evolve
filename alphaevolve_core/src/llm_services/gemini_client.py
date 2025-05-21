import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env

class GeminiClient:
    def __init__(self, model_name="gemini-1.5-flash-latest"): # Or gemini-1.5-pro-latest
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(model_name)

    def generate_text(self, prompt, temperature=0.7, #... other params
                     safety_settings=None # Configure as needed
                     ):
        try:
            # Example safety settings - adjust as per your needs & Gemini docs
            # Consult Gemini documentation for specific safety setting options
            # default_safety_settings = [
            #     {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            #     {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            #     {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            #     {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            # ]
            # current_safety_settings = safety_settings if safety_settings is not None else default_safety_settings

            response = self.model.generate_content(
                prompt,
                # generation_config=genai.types.GenerationConfig(temperature=temperature, ...),
                # safety_settings=current_safety_settings
            )
            # Handle potential blocks due to safety or other reasons
            if not response.candidates or not response.candidates[0].content.parts:
                 # Check response.prompt_feedback for block reasons
                block_reason = response.prompt_feedback.block_reason if response.prompt_feedback else "Unknown"
                print(f"WARN: Generation blocked or empty. Reason: {block_reason}")
                # print(f"Full response: {response}") # For debugging
                return "" # Or raise an exception
            return response.text
        except Exception as e:
            print(f"Error generating text with Gemini: {e}")
            return "" # Or re-raise
