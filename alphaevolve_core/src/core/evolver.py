import time
from typing import Any

from alphaevolve_core.src.core.population import Population
from alphaevolve_core.src.core.selection import SelectionStrategy, TournamentSelection
from alphaevolve_core.src.evaluation.fitness import FitnessEvaluator
from alphaevolve_core.src.evaluation.sandbox import DockerSandbox # Assuming DockerSandbox is used
from alphaevolve_core.src.llm_services.gemini_client import GeminiClient
from alphaevolve_core.src.llm_services.prompt_generation import EvolvePromptGenerator
from alphaevolve_core.src.llm_services.program_generation import ProgramGenerator
from alphaevolve_core.src.llm_services.program_correction import ProgramCorrector

class Evolver:
    def __init__(self, project_def: Any, population_size: int = 50, generations: int = 100,
                 tournament_size: int = 5, gemini_model: str = "gemini-1.5-flash-latest"):
        self.project_def = project_def
        self.population_size = population_size
        self.generations = generations
        self.tournament_size = tournament_size
        self.gemini_model = gemini_model

        self.gemini_client = GeminiClient(model_name=self.gemini_model)
        self.prompt_generator = EvolvePromptGenerator(self.gemini_client)
        self.program_generator = ProgramGenerator(self.gemini_client)
        self.program_corrector = ProgramCorrector(self.gemini_client)
        self.fitness_evaluator = FitnessEvaluator() # Sandbox will be initialized within evaluate
        self.selection_strategy: SelectionStrategy = TournamentSelection(self.tournament_size)
        self.population = Population(max_size=self.population_size)

    def initialize_population(self, initial_programs: list[str] = None):
        """Initializes the population, optionally with provided programs."""
        if initial_programs:
            print(f"Initializing population with {len(initial_programs)} provided programs.")
            for code in initial_programs:
                fitness, details = self.fitness_evaluator.evaluate(code, self.project_def)
                self.population.add_individual(code, fitness, metadata=details)
        else:
            print("Initializing population by generating initial programs...")
            # Generate a few initial programs directly from the project description
            initial_prompt = f"""Write a Python function that solves the following project: {self.project_def.description}
Implement the function with the signature: {self.project_def.signature}
Output only the Python code for the function within a single triple backtick block.
"""
            for _ in range(min(5, self.population_size)): # Generate a few initial individuals
                 code = self.program_generator.generate_program(initial_prompt)
                 if code:
                     fitness, details = self.fitness_evaluator.evaluate(code, self.project_def)
                     self.population.add_individual(code, fitness, metadata=details)

    def evolve(self):
        """Runs the main evolutionary loop."""
        print("Starting evolutionary process...")
        start_time = time.time()

        for generation in range(self.generations):
            print(f"\n--- Generation {generation + 1}/{self.generations} ---")

            if len(self.population) < 2: # Need at least two individuals for selection
                 print("Population size too small for evolution. Stopping.")
                 break

            # Selection
            parents = self.selection_strategy.select(self.population.individuals, num_parents=2) # Select 2 parents

            # Evolution (Generate offspring)
            evolve_prompt = self.prompt_generator.generate_evolve_prompt(self.project_def, parents)
            offspring_code = self.program_generator.generate_program(evolve_prompt)

            if offspring_code:
                # Evaluation
                fitness, eval_details = self.fitness_evaluator.evaluate(offspring_code, self.project_def)
                final_offspring_code = offspring_code

                # Program Correction (Optional)
                if fitness < 1.0: # Assuming 1.0 is perfect fitness
                    print("Attempting to correct offspring...")
                    corrected_code = self.program_corrector.correct_program(offspring_code, eval_details, self.project_def)
                    if corrected_code and corrected_code != offspring_code:
                        print("Correction successful. Re-evaluating corrected code.")
                        corrected_fitness, corrected_details = self.fitness_evaluator.evaluate(corrected_code, self.project_def)
                        if corrected_fitness > fitness: # Only use corrected code if it's better
                            fitness = corrected_fitness
                            final_offspring_code = corrected_code
                            eval_details = corrected_details
                            print(f"Corrected code improved fitness to {fitness}")
                        else:
                             print("Corrected code did not improve fitness.")
                    else:
                         print("Correction did not result in different or valid code.")


                # Population Update
                self.population.add_individual(final_offspring_code, fitness, metadata=eval_details)
                print(f"Added offspring with fitness: {fitness}")

            # Log progress
            best_fitness = self.population.get_fittest()['fitness'] if self.population.get_fittest() else 0.0
            avg_fitness = self.population.get_average_fitness()
            print(f"Population size: {len(self.population)}, Best Fitness: {best_fitness:.4f}, Average Fitness: {avg_fitness:.4f}")

            # Check termination condition
            if best_fitness >= 1.0:
                print("\nSolution found!")
                break

        end_time = time.time()
        print(f"\nEvolution finished after {generation + 1} generations in {end_time - start_time:.2f} seconds.")
        print("Fittest individual:")
        fittest = self.population.get_fittest()
        if fittest:
            print(fittest['code'])
            print(f"Fitness: {fittest['fitness']}")
        else:
            print("No individuals in the population.")
