from src.models import skill_model


def list_skills():
    skills = skill_model.list_all()
    return {"skills": skills}, 200
