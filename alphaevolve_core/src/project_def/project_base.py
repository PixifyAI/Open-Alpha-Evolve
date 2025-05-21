from abc import ABC, abstractmethod
from typing import List, Dict, Any

class ProjectBase(ABC):
    @property
    @abstractmethod
    def description(self) -> str:
        pass

    @property
    @abstractmethod
    def function_name(self) -> str:
        pass

    @property
    @abstractmethod
    def signature(self) -> str:
        pass

    @property
    @abstractmethod
    def test_cases(self) -> List[Dict[str, Any]]:
        pass
