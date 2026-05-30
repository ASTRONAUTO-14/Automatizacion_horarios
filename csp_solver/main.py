import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Tuple
from ortools.sat.python import cp_model

app = FastAPI(title="Scheduling CSP Optimization API")

class Teacher(BaseModel):
    id: str
    max_hours: int
    availabilities: List[Dict[str, int]]  # e.g., [{"day": 0, "slot": 1}]
    competencies: List[str]  # list of course ids

class CohortClass(BaseModel):
    id: str
    course_id: str
    cohort_id: str
    required_hours: int
    students_count: int

class Room(BaseModel):
    id: str
    capacity: int

class OptimizationRequest(BaseModel):
    teachers: List[Teacher]
    classes: List[CohortClass]
    rooms: List[Room]
    days: int = 5
    slots_per_day: int = 5

class AssignedSession(BaseModel):
    class_id: str
    teacher_id: str
    room_id: str
    day: int
    slot: int

class OptimizationResponse(BaseModel):
    status: str
    sessions: List[AssignedSession]
    message: str = ""

@app.post("/optimize", response_model=OptimizationResponse)
def optimize_schedule(req: OptimizationRequest):
    model = cp_model.CpModel()
    assign = {}
    
    teacher_avail = {}
    for t in req.teachers:
        avail_set = set((a['day'], a['slot']) for a in t.availabilities)
        teacher_avail[t.id] = avail_set

    for c in req.classes:
        eligible_teachers = [t for t in req.teachers if c.course_id in t.competencies]
        eligible_rooms = [r for r in req.rooms if r.capacity >= c.students_count]

        for t in eligible_teachers:
            for r in eligible_rooms:
                for d in range(req.days):
                    for s in range(req.slots_per_day):
                        if (d, s) in teacher_avail[t.id]:
                            assign[(c.id, t.id, r.id, d, s)] = model.NewBoolVar(f'assign_c{c.id}_t{t.id}_r{r.id}_d{d}_s{s}')

    if not assign:
        return OptimizationResponse(status="INFEASIBLE", sessions=[], message="No valid initial assignments possible.")

    for c in req.classes:
        class_vars = [v for k, v in assign.items() if k[0] == c.id]
        if not class_vars:
            return OptimizationResponse(status="INFEASIBLE", sessions=[], message=f"Class {c.id} has no valid combination of teacher/room/slot.")
        model.AddExactlyK(class_vars, c.required_hours)

    for t in req.teachers:
        for d in range(req.days):
            for s in range(req.slots_per_day):
                teacher_vars = [v for k, v in assign.items() if k[1] == t.id and k[3] == d and k[4] == s]
                if len(teacher_vars) > 1:
                    model.AddAtMostOne(teacher_vars)

    for r in req.rooms:
        for d in range(req.days):
            for s in range(req.slots_per_day):
                room_vars = [v for k, v in assign.items() if k[2] == r.id and k[3] == d and k[4] == s]
                if len(room_vars) > 1:
                    model.AddAtMostOne(room_vars)

    cohorts = set(c.cohort_id for c in req.classes)
    for cohort_id in cohorts:
        cohort_classes = [c.id for c in req.classes if c.cohort_id == cohort_id]
        for d in range(req.days):
            for s in range(req.slots_per_day):
                cohort_vars = [v for k, v in assign.items() if k[0] in cohort_classes and k[3] == d and k[4] == s]
                if len(cohort_vars) > 1:
                    model.AddAtMostOne(cohort_vars)

    for t in req.teachers:
        teacher_all_vars = [v for k, v in assign.items() if k[1] == t.id]
        if teacher_all_vars:
            model.Add(sum(teacher_all_vars) <= t.max_hours)

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 60.0 
    
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        sessions = []
        for k, v in assign.items():
            if solver.Value(v) == 1:
                sessions.append(AssignedSession(
                    class_id=k[0],
                    teacher_id=k[1],
                    room_id=k[2],
                    day=k[3],
                    slot=k[4]
                ))
        return OptimizationResponse(
            status="SUCCESS", 
            sessions=sessions, 
            message="Optimo." if status == cp_model.OPTIMAL else "Factible."
        )
    elif status == cp_model.INFEASIBLE:
        return OptimizationResponse(status="INFEASIBLE", sessions=[], message="No existe un horario factible con estas reglas duras.")
    else:
        return OptimizationResponse(status="UNKNOWN", sessions=[], message="Timeout del solver.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
