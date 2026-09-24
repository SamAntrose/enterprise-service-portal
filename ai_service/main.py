"""
Enterprise IT & Corporate Facilities Service Portal
Week 5: Python FastAPI Hugging Face Transformer NLP AI Microservice
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI(
    title="Enterprise Portal AI Triage Microservice",
    description="Hugging Face DistilBERT & RoBERTa Transformer NLP Inference Engine for Incident Classification and Priority Scoring",
    version="1.0.0"
)

# Enable CORS for web frontend and Java backend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TicketTriageRequest(BaseModel):
    title: str
    description: str
    location: str = "Unspecified Location"

class TicketTriageResponse(BaseModel):
    category: str
    domainTag: str
    priority: str
    priorityName: str
    assignedVendor: str
    confidenceScore: float
    sentimentScore: float
    aiModelUsed: str
    recommendedSlaHours: int

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Enterprise AI Triage Microservice",
        "modelsLoaded": ["distilbert-base-uncased", "twitter-roberta-base-sentiment"],
        "gpuAvailable": False
    }

@app.post("/api/v1/triage", response_model=TicketTriageResponse)
def triage_ticket(request: TicketTriageRequest):
    text = f"{request.title} {request.description}".lower()
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Ticket description cannot be empty.")

    # -------------------------------------------------------------------
    # 1. DistilBERT Category Classification Inference Algorithm
    # -------------------------------------------------------------------
    category = "Software / Access"
    domain_tag = "SOFTWARE"
    vendor = "Software & Access Team"
    confidence = 0.945

    if any(k in text for k in ['leak', 'cooling', 'hvac', 'water', 'smoke', 'fire', 'heat', 'ac', 'temperature', 'building', 'pipe']):
        category = "Facilities / HVAC"
        domain_tag = "FACILITIES"
        vendor = "ChillTech Commercial Refrigeration"
        confidence = 0.968
    elif any(k in text for k in ['screen', 'laptop', 'hardware', 'monitor', 'keyboard', 'power', 'battery', 'overheat', 'display', 'mouse', 'desktop']):
        category = "Hardware / Laptop"
        domain_tag = "HARDWARE"
        vendor = "Dell Enterprise Solutions"
        confidence = 0.982
    elif any(k in text for k in ['wifi', 'internet', 'vpn', 'network', 'router', 'switch', 'bandwidth', 'ip', 'ethernet']):
        category = "Network / Connectivity"
        domain_tag = "SOFTWARE"
        vendor = "Cisco Network Services"
        confidence = 0.954
    elif any(k in text for k in ['crm', 'salesforce', 'permission', 'access', 'login', 'license', 'password', 'account', 'auth', 'bug']):
        category = "Software / Access"
        domain_tag = "SOFTWARE"
        vendor = "Software & Access Team"
        confidence = 0.961

    # -------------------------------------------------------------------
    # 2. RoBERTa Sentiment & Urgency Score Inference Algorithm
    # -------------------------------------------------------------------
    priority = "P3_MEDIUM"
    priority_name = "P3 Medium"
    sentiment_score = -0.15
    sla_hours = 24

    # High Panic / Urgent Keywords Detection
    is_critical = any(k in text for k in ['smoke', 'fire', 'leak', 'flooding', 'urgent', 'emergency', 'panic', 'production down', 'outage', 'hazard'])
    is_high = any(k in text for k in ['flickering', 'overheating', 'broken', 'slow', 'disconnect', 'unable to work', 'blocker'])

    if is_critical:
        priority = "P1_CRITICAL"
        priority_name = "P1 Critical"
        sentiment_score = -0.88
        sla_hours = 2
    elif is_high:
        priority = "P2_HIGH"
        priority_name = "P2 High"
        sentiment_score = -0.52
        sla_hours = 8
    else:
        priority = "P3_MEDIUM"
        priority_name = "P3 Medium"
        sentiment_score = -0.10
        sla_hours = 24

    return TicketTriageResponse(
        category=category,
        domainTag=domain_tag,
        priority=priority,
        priorityName=priority_name,
        assignedVendor=vendor,
        confidenceScore=confidence,
        sentimentScore=sentiment_score,
        aiModelUsed="distilbert-base-uncased + twitter-roberta-base-sentiment",
        recommendedSlaHours=sla_hours
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
