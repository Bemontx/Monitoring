
from django.shortcuts import render, redirect
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated    
from rest_framework import authentication
from.models import Carros
from.serializers import CarrosSerializer
from .forms import CommentsForm

# Create your views here.
class CarrosViewset(viewsets.ModelViewSet):
    queryset = Carros.objects.all()
    serializer_class = CarrosSerializer
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [AllowAny]
    
def indexVieset(request):
    context={}
    return render(request, 'index.html', context)

def comprasViewset(request):
    context={}
    return render(request, 'compras.html', context)

def contactoViewset(request):
    context={}
    return render(request, 'contacto.html', context)

def contacto_view(request):
    if request.method == 'POST':
        form = CommentsForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.save()
            return redirect('contacto')
    else:
        form = CommentsForm()

    return render(request, 'contacto.html', {'form': form})    

def home(request):
    return render(request, 'home.html')

# def security(request):
#     return render(request, 'security.html')
