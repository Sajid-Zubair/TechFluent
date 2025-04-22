from rest_framework.decorators import api_view
from rest_framework.response import Response
import whisper
import os
from groq import Groq
import subprocess
from dotenv import load_dotenv 

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
        
        # Temporary fallback for testing frontend connectivity
        if not os.getenv("GROQ_API_KEY"):
            print("Warning: GROQ_API_KEY not set, returning fallback question")
            return Response({"question": "Fallback question: Tell me about yourself."})
        
        if qtype == 'Technical' and subject:
            prompt = f"Generate one short and concise theoretical random technical interview question for the subject: {subject} which can be answered orally."
        elif qtype == 'Behavioural':
            prompt = "Generate one unique random behavioral interview question."
        
        print("Making API call to Groq...")
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}]
        )
        # question = response.choices[0].message.content.strip()

        import re
        raw_question = response.choices[0].message.content.strip()
        match = re.search(r'"(.*?)"', raw_question)
        question = match.group(1) if match else raw_question
        
        print(f"Generated question: {question[:50]}...")
        return Response({"question": question})
    except Exception as e:
        print(f"Error in get_question view: {str(e)}")
        print(traceback.format_exc())
        return Response({"question": "An error occurred, but here's a sample question: What are your greatest strengths?", 
                         "error": str(e)}, status=200)


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
    1. Coherence
    2. Relevance
    3. Fluency
    4. Content Structure
    5. Vocabulary
    6. Accuracy

    Interview Answer:
    {transcription}
    """
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}]
    )
    rating = response.choices[0].message.content.strip()

    # Parse the rating response to extract individual ratings
    # ratings = {}
    # for line in rating.splitlines():
    #     if ":" in line:
    #         key, value = line.split(":", 1)
    #         ratings[key.strip()] = value.strip().split(" ")[0]
    # Extract ratings using regex to handle different formats like bold, markdown, or text
    import re
    pattern = r"(Coherence|Relevance|Fluency|Content Structure|Vocabulary|Accuracy)\s*[:\-–]\s*(\d{1,2}/10)"
    matches = re.findall(pattern, rating, flags=re.IGNORECASE)

    # Normalize keys and store in dictionary
    rating = {key.capitalize(): value for key, value in matches}

    # Feedback from Groq
    prompt = f"How would I improve this interview answer: {transcription}"
    
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}]
    )
    feedback = response.choices[0].message.content.strip()

    os.remove("temp_audio.webm")
    os.remove("temp_audio.wav")

    return Response({
        "transcription": transcription,
        "feedback": feedback,
        "rating": rating
    })
