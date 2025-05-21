# AlphaEvolve Core

This is the core Python implementation of the Open AlphaEvolve project, leveraging LLMs for code evolution.

## Setup

1. Clone the repository.
2. Navigate to the `alphaevolve_core` directory.
3. Set up a Python virtual environment: `python -m venv venv`
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Create a `.env` file in the `alphaevolve_core` directory with your Gemini API key: `GEMINI_API_KEY="YOUR_API_KEY"`

## Running

(Instructions will be added here as the project develops)

## Structure

```
alphaevolve_core/
├── venv/
├── src/
│   ├── core/                     # Core evolutionary logic
│   ├── llm_services/             # Interface with Gemini API
│   ├── project_def/              # Project definitions and test cases
│   │   └── projects/             # Specific project instances
│   ├── evaluation/               # Code execution and fitness calculation
│   ├── utils/                    # Helper functions
│   └── main.py                   # Main script to run the evolution
├── tests/                        # Unit and integration tests
├── data/                         # To store results, logs, intermediate programs
├── .env
├── .gitignore
├── README.md
└── requirements.txt
