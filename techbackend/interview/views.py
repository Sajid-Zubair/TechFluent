from rest_framework.decorators import api_view
from rest_framework.response import Response
import whisper
import os
from groq import Groq
import subprocess
from dotenv import load_dotenv 
import json
import random, time

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
model = whisper.load_model("base")

@api_view(['GET'])
def get_question(request):
    import traceback

    try:
        print("get_question view called")
        print(f"API key present: {'Yes' if os.getenv('GROQ_API_KEY') else 'No'}")

        qtype = request.GET.get('type')
        subject = None

        if qtype == 'Technical':
            subject = request.GET.get('subject', '')

        print(f"Request parameters - Type: {qtype}, Subject: {subject}")

        # Fallback if API key is missing
        if not os.getenv("GROQ_API_KEY"):
            print("Warning: GROQ_API_KEY not set, returning fallback question")
            return Response({
                "question": "Fallback question: Tell me about yourself."
            })

        # Random seed to encourage different questions
        rand_seed = f"UniqueID-{random.randint(1000,9999)}-{int(time.time())}"

        # ---------------------------------------
        # TECHNICAL QUESTION
        # ---------------------------------------
        if qtype == 'Technical' and subject:

            prompt = f"""
Generate exactly ONE technical interview question.

Subject: {subject}

Requirements:
1. The question must be fully answerable orally.
2. It should test conceptual understanding.
3. It should be answerable within approximately 1 minute.
4. Do not ask for code, calculations, or numerical problems.
5. Make it suitable for a real technical interview.
6. Use clear and professional language.
7. Do not provide the answer.
8. Do not provide explanations.
9. Return ONLY the question itself.
10. Do not use labels such as "Question:".
11. Do not use quotation marks.

Generate a different question from previous requests.

{rand_seed}
"""

        # ---------------------------------------
        # BEHAVIOURAL QUESTION
        # ---------------------------------------
        elif qtype == 'Behavioural':

            prompt = f"""
Generate exactly ONE behavioral interview question.

Requirements:
1. It should encourage the candidate to describe a real experience.
2. It should be answerable orally in approximately 1-2 minutes.
3. It should evaluate qualities such as teamwork, leadership,
   adaptability, communication, problem-solving, or conflict resolution.
4. Do not ask a yes/no question.
5. Use clear and professional language.
6. Make it suitable for a real job interview.
7. Do not provide the answer.
8. Do not provide explanations.
9. Return ONLY the question itself.
10. Do not use labels such as "Question:".
11. Do not use quotation marks.

Vary the focus between teamwork, leadership, adaptability,
communication, problem-solving, and conflict resolution.

Generate a different question from previous requests.

{rand_seed}
"""

        else:
            return Response({
                "error": "Invalid question type or missing subject."
            }, status=400)

        print("Making API call to Groq...")

        # ---------------------------------------
        # GROQ API CALL
        # ---------------------------------------
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You generate concise interview questions."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.8,
            top_p=0.9,
            max_tokens=500
        )

        # ---------------------------------------
        # GET RESPONSE
        # ---------------------------------------
        raw_question = response.choices[0].message.content.strip()

        print("RAW GROQ RESPONSE:")
        print(repr(raw_question))

        # Clean accidental quotation marks
        question = raw_question.strip().strip('"').strip("'").strip()

        print(f"Generated question: {question}")

        # ---------------------------------------
        # RETURN JSON TO FRONTEND
        # ---------------------------------------
        return Response({
            "question": question
        })

    except Exception as e:

        print(f"Error in get_question view: {str(e)}")
        print(traceback.format_exc())

        return Response({
            "question": "An error occurred, but here's a sample question: What are your greatest strengths?",
            "error": str(e)
        }, status=200)

@api_view(['POST'])
def process_audio(request):
    if "audio" not in request.FILES:
        return Response({"error": "No audio uploaded."}, status=400)

    audio_file = request.FILES['audio']
    with open("temp_audio.webm", "wb+") as destination:
        for chunk in audio_file.chunks():
            destination.write(chunk)

    subprocess.run(["ffmpeg", "-i", "temp_audio.webm", "-ar", "16000", "-ac", "1", "temp_audio.wav", "-y"])
    result = model.transcribe("temp_audio.wav")
    transcription = result["text"]

    # prompt = f"Rate the coherence,relevance, fluency,content stucture,vocabulary, accuracy of this interview answer out of 10: {transcription}"
    prompt = f"""
    Rate the following aspects of this interview answer out of 10, and return each in the format: 
    Metric: Score/10

    Metrics:
    1. Fluency 
    2. Content Structure
    3. Accuracy 
    4. Grammar
    5. Vocabulary 
    6. Coherence 

    Interview Answer:
    {transcription}
    """
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}]
    )
    rating = response.choices[0].message.content.strip()
    print("RAW RATING STRING:\n", rating)
    
    import re
    pattern = r"(Fluency|Content Structure|Accuracy|Grammar|Vocabulary|Coherence)\s*[:\-–]\s*(\d{1,2}/10)"
    matches = re.findall(pattern, rating, flags=re.IGNORECASE)

    # Normalize keys and store in dictionary
    # rating = {key.capitalize(): value for key, value in matches}
    rating_dict = {}
    for key, value in matches:
        try:
            score = int(value.strip().split('/')[0])
            rating_dict[key.strip().lower().replace(" ", "_")] = score
        except:
            rating_dict[key.strip().lower().replace(" ", "_")] = 0

    # Feedback from Groq
    #prompt = f"Tell me all the positive and negative aspects of this interview answer.How would I improve this interview answer: {transcription}? and dont include any stars and give pointwise feedback. Make sure you provide a correct answer to the question if {transcription} is wrong."
    prompt = f"""
                The following is a technical interview answer given by a candidate. Please:

                1. First, provide the correct and complete answer to the question **if** the candidate's answer is incorrect or incomplete and **if** the question is a technical question.
                2. Then, list all **positive** and **negative** aspects of the given answer.
                3. Finally, rewrite the answer in a more refined, well-structured, and professional way, suitable for a spoken technical interview. Use STAR (Situation, Task, Action, Result) format if applicable.
                Provide the feedback in a detailed and pointwise manner.
                Candidate's Answer:
                {transcription}

                Format your response as:
                Correct Answer (if applicable):
                <your answer here>

                Positive Points:
                - ...
                Negative Points:
                - ...

                Improved Answer:
                <refined version here>
                """
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}]
    )
    feedback = response.choices[0].message.content.strip()

    os.remove("temp_audio.webm")
    os.remove("temp_audio.wav")

    return Response({
        "transcription": transcription,
        "feedback": feedback,
        "rating": rating_dict
    })



@api_view(['POST'])
def get_answer(request):
    try:
        # body = json.loads(request.body)
        body = request.data
        query = body.get('query', '')

        if not query:
            return Response({"error": "Query field is missing."}, status=400)

        prompt = f"You are a helpful assistant. Answer this: {query} and provide clickable links if needed"

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": query}
            ]
        )

        answer = response.choices[0].message.content.strip()

        return Response({"answer": answer})

    except Exception as e:
        return Response({
            "answer": "An error occurred while generating the answer.",
            "error": str(e)
        }, status=500)
    




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from apify_client import ApifyClient

@csrf_exempt
def job_search(request):
    job_role = request.GET.get("job_role", "")
    location = request.GET.get("location", "")
    limit = int(request.GET.get("limit", 20))  # Optional limit on number of jobs

    if not job_role or not location:
        return JsonResponse({"error": "job_role and location are required"}, status=400)

    api_token = os.getenv("APIFY_TOKEN")
    client = ApifyClient(api_token)  # Use your actual Apify token here

    run_input = {
        "title": job_role,
        "location": location,
        "limit": limit,
        # Add other inputs supported by your actor if needed
    }

    try:
        # Replace this with your actual Actor ID on Apify platform
        actor_id = "TrtlecxAsNRbKl1na"

        # Call the actor and wait for the run to finish
        run = client.actor(actor_id).call(run_input=run_input)

        # Fetch results from the dataset
        dataset = client.dataset(run["defaultDatasetId"])
        jobs = list(dataset.iterate_items())
        processed_jobs = []
        for job in jobs:
            # Try multiple possible description fields from Apify result
            raw_description = (
                job.get("description")
                or job.get("jobDescription")
                or job.get("snippet")
                or ""
            )

            # Make sure it's a string
            if not isinstance(raw_description, str):
                raw_description = str(raw_description)

            clean_description = (
                raw_description
                .replace("\\n", " ")   # handle escaped \n
                .replace("\n", " ")    # handle real newlines
                .replace("\r", " ")    # handle carriage returns
            )

            clean_description = " ".join(clean_description.split())  # collapse multiple spaces

            # Trim to first 25 words
            words = clean_description.split()
            short_description = " ".join(words[:25]) + (" ..." if len(words) > 25 else "")



            # Keep only the short description for frontend
            job["description"] = short_description

            processed_jobs.append(job)

        return JsonResponse({"jobs": processed_jobs}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import fitz  # PyMuPDF for PDF
from docx import Document  # python-docx for DOCX
from groq import Groq
from dotenv import load_dotenv
import re
import traceback as trackback

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_from_pdf(file):
    """Extract text from PDF using PyMuPDF"""
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_text_from_docx(file):
    """Extract text from DOCX using python-docx"""
    document = Document(file)
    text = "\n".join([para.text for para in document.paragraphs])
    return text

@api_view(['POST'])
def resume_analyzer(request):
    try:
        file = request.FILES.get("resume")

        if not file:
            return Response(
                {"error": "No resume uploaded."},
                status=400
            )

        # ---------------------------------------
        # EXTRACT TEXT FROM RESUME
        # ---------------------------------------

        ext = os.path.splitext(file.name)[1].lower()

        if ext == ".pdf":
            resume_text = extract_text_from_pdf(file)

        elif ext == ".docx":
            resume_text = extract_text_from_docx(file)

        else:
            return Response(
                {
                    "error": "Unsupported file type. Please upload PDF or DOCX."
                },
                status=400
            )

        if not resume_text or not resume_text.strip():
            return Response(
                {"error": "Could not extract text from resume."},
                status=400
            )

        # ---------------------------------------
        # LIMIT EXTREMELY LARGE RESUMES
        # ---------------------------------------

        resume_text = resume_text[:30000]

        print("Resume text extracted successfully.")
        print(f"Resume text length: {len(resume_text)} characters")

        # ---------------------------------------
        # PROMPT
        # ---------------------------------------

        prompt = f"""
You are an experienced technical hiring manager and professional resume reviewer.

Analyze the following candidate resume carefully.

Provide useful, specific and actionable feedback.

Resume:

{resume_text}

Evaluate the resume using these six categories:

1. Overall Impression
Give a brief summary of the resume's overall quality, strengths,
weaknesses, and suitability for job applications.

2. Content & Skills
Evaluate the candidate's technical skills, projects, education,
work experience, and relevance to technical/software engineering roles.
Mention important missing skills if appropriate.

3. Clarity & Impact
Evaluate whether the resume communicates achievements clearly.
Check the use of action verbs, measurable results, and concise
descriptions. Suggest specific improvements.

4. Formatting & Readability
Evaluate section organization, consistency, spacing, readability,
and whether the resume is easy for a recruiter to scan.

5. ATS Compatibility
Evaluate whether the resume is likely to be parsed correctly by
Applicant Tracking Systems. Identify formatting issues and missing
keywords where appropriate.


6. Final Score
Give the resume a score from 1 to 10 based on how ready it is for
applying to software/technical jobs.

Be honest but constructive.

Do not rewrite the entire resume.

Keep each section concise but useful.
"""

        print("Sending resume to Groq...")

        # ---------------------------------------
        # GROQ API CALL
        # ---------------------------------------

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional resume reviewer. "
                        "Return accurate, structured resume feedback."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "resume_analysis",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "overall_impression": {
                                "type": "string"
                            },
                            "content_skills": {
                                "type": "string"
                            },
                            "clarity_impact": {
                                "type": "string"
                            },
                            "formatting_readability": {
                                "type": "string"
                            },
                            "ats_compatibility": {
                                "type": "string"
                            },
                            "final_score": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "overall_impression",
                            "content_skills",
                            "clarity_impact",
                            "formatting_readability",
                            "ats_compatibility",
                            "final_score"
                        ],
                        "additionalProperties": False
                    }
                }
            },

            temperature=0.4,
            max_tokens=5000
        )

        # ---------------------------------------
        # PARSE GROQ RESPONSE
        # ---------------------------------------

        raw_analysis = response.choices[0].message.content.strip()

        print("RAW RESUME ANALYSIS:")
        print(raw_analysis)

        analysis = json.loads(raw_analysis)

        # ---------------------------------------
        # RETURN RESPONSE
        # ---------------------------------------

        return Response({
            "analysis": analysis
        })

    except json.JSONDecodeError as e:

        print("JSON parsing error:")
        print(str(e))

        return Response(
            {
                "error": "Could not parse resume analysis.",
                "details": str(e)
            },
            status=500
        )

    except Exception as e:

        print("Resume analyzer error:")
        print(str(e))
        trackback.print_exc()

        return Response(
            {
                "error": "An error occurred while analyzing the resume.",
                "details": str(e)
            },
            status=500
        )