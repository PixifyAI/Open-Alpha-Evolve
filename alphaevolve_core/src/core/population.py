from typing import List, Dict, Any, Tuple

class Population:
    def __init__(self, max_size: int):
        self.max_size = max_size
        self.individuals: List[Dict[str, Any]] = [] # Stores {'code': str, 'fitness': float, ...}

    def add_individual(self, code: str, fitness: float, metadata: Dict[str, Any] = None):
        """Adds a new individual to the population."""
        individual = {'code': code, 'fitness': fitness}
        if metadata:
            individual.update(metadata)
        self.individuals.append(individual)
        self._maintain_size()

    def _maintain_size(self):
        """Sorts the population by fitness and truncates to max_size."""
        self.individuals.sort(key=lambda x: x['fitness'], reverse=True)
        self.individuals = self.individuals[:self.max_size]

    def get_fittest(self) -> Dict[str, Any] | None:
        """Returns the fittest individual in the population."""
        if not self.individuals:
            return None
        return self.individuals[0]

    def select_parents(self, num_parents: int) -> List[Dict[str, Any]]:
        """
        Selects parents from the population (placeholder - implement selection strategies).
        For now, just returns the top num_parents individuals.
        """
        return self.individuals[:num_parents]

    def get_average_fitness(self) -> float:
        """Calculates the average fitness of the population."""
        if not self.individuals:
            return 0.0
        return sum(ind['fitness'] for ind in self.individuals) / len(self.individuals)

    def __len__(self):
        return len(self.individuals)
