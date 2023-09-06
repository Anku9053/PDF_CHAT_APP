from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import PDFChat
from .serializers import PDFChatSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PDFChat
from rest_framework.authtoken.models import Token

# Create your views here.
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserSerializer
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import pickle
from rest_framework.authtoken.models import Token
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback
from rest_framework.decorators import api_view
os.environ["OPENAI_API_KEY"] = "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"
@csrf_exempt
@api_view(['POST'])
def pdf_chat_backend(request):
    if request.method == 'POST':
        pdf_file = request.FILES.get('pdf')
        if pdf_file:
            pdf_reader = PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len
            )
            chunks = text_splitter.split_text(text=text)

            store_name = pdf_file.name[:-4]

            if os.path.exists(f"{store_name}.pkl"):
                with open(f"{store_name}.pkl", "rb") as f:
                    VectorStore = pickle.load(f)
            else:
                embeddings = OpenAIEmbeddings(openai_api_key='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')
                VectorStore = FAISS.from_texts(chunks, embedding=embeddings)
                with open(f"{store_name}.pkl", "wb") as f:
                    pickle.dump(VectorStore, f)

            query = request.POST.get('query')

            
            if query:
                docs = VectorStore.similarity_search(query=query, k=3)
                llm = OpenAI()
                chain = load_qa_chain(llm=llm, chain_type="stuff")
                with get_openai_callback() as cb:
                    response = chain.run(input_documents=docs, question=query)
                return JsonResponse({'response': response})
    return JsonResponse({'response': 'Invalid request.'})

@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response({'error': 'Username, password, and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        # Generate and return an authentication token upon successful signup
        token = Token.objects.create(user=user)
        user_serializer = UserSerializer(user)
        return Response({'user': user_serializer.data, 'token': token.key}, status=status.HTTP_201_CREATED)

# API view for user login
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate and return an authentication token upon successful login
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({'user': user_serializer.data, 'token': token.key})

# API view for saving PDF chats
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_pdf_chat(request):
    serializer = PDFChatSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view for retrieving PDF chat history
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pdf_chat_history(request, pdf_id):
    chats = PDFChat.objects.filter(pdf_file_id=pdf_id, user=request.user).order_by('-timestamp')
    serializer = PDFChatSerializer(chats, many=True)
    return Response(serializer.data)

# API view for retrieving all saved chats
class SavedChats(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve all saved chats from the database
        saved_chats = PDFChat.objects.all()

        # Serialize the data (convert it to JSON)
        serialized_chats = PDFChatSerializer(saved_chats, many=True)

        return Response(serialized_chats.data)