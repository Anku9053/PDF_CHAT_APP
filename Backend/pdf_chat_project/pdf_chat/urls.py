from django.urls import path
from . import views
from django.urls import path
from .views import SavedChats

urlpatterns = [
    path('pdf_chat_backend/', views.pdf_chat_backend, name='pdf_chat_backend'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('save-pdf-chat/', views.save_pdf_chat, name='save-pdf-chat'),
    path('pdf-chat-history/<int:pdf_id>/', views.get_pdf_chat_history, name='pdf-chat-history'),
    path('api/saved-chats/', SavedChats.as_view(), name='saved-chats'),
]