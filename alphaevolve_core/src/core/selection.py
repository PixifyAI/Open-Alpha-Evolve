from typing import List, Dict, Any
import random

class SelectionStrategy:
    def select(self, population: List[Dict[str, Any]], num_parents: int) -> List[Dict[str, Any]]:
        """
        Selects parents from the population based on a specific strategy.

        Args:
            population: The list of individuals in the population.
            num_parents: The number of parents to select.

        Returns:
            A list of selected parent individuals.
        """
        # This is a base class. Specific strategies will inherit from this.
        raise NotImplementedError("Selection strategy not implemented.")

class TournamentSelection(SelectionStrategy):
    def __init__(self, tournament_size: int):
        self.tournament_size = tournament_size

    def select(self, population: List[Dict[str, Any]], num_parents: int) -> List[Dict[str, Any]]:
        """Selects parents using tournament selection."""
        selected_parents = []
        for _ in range(num_parents):
            tournament_contestants = random.sample(population, min(self.tournament_size, len(population)))
            winner = max(tournament_contestants, key=lambda x: x['fitness'])
            selected_parents.append(winner)
        return selected_parents

# Add other selection strategies here (e.g., RouletteWheelSelection, EliteSelection)
