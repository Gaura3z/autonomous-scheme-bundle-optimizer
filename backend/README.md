# Autonomous Scheme-Bundle Optimizer (PS16) — Python Backend

## Architecture Overview
This backend implements the deterministic decision pipeline for **Kurukshetra 2.0 HACKFEST 2026 PS16**:
1. **Control Plane**: `BenefitStrategistOrchestrator` (`orchestrator.py`)
2. **Deterministic Rules**: `engines/eligibility.py`
3. **Negative Exclusions**: `engines/exclusions.py`
4. **Conflict Detection**: `engines/conflicts.py`
5. **Mathematical Optimization**: `engines/optimizer.py` (PuLP + CBC ILP Solver)
6. **Document Readiness**: `engines/documents.py` (DAG prerequisite mapper)
7. **Roadmap Sequencer**: `engines/roadmap.py` (Topological action plan)
8. **API Tier**: `main.py` (FastAPI + Pydantic v2 schemas)

## Installation & Running

```bash
# 1. Install dependencies
cd backend
pip install -r requirements.txt

# 2. Run the FastAPI server
uvicorn main:app --reload --port 8000

# 3. Run Pytest engine test suite
pytest tests/ -v
```

## Core Principle
> **AI does NOT decide eligibility.** The decision-critical path is 100% deterministic:
> `Rules -> Eligibility -> Exclusions -> Conflicts -> PuLP Optimization -> Documents -> Roadmap`.
> Gemini LLM is used only post-decision to generate accessible natural language explanations.
