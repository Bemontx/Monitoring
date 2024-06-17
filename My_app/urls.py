from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CarrosViewset, indexVieset, comprasViewset, contactoViewset, home
router = DefaultRouter()
router.register(r'carros', CarrosViewset)

app_name = 'home'

urlpatterns = [
    path('',home, name='home'),
    path('api/', include(router.urls)),  
    path('index/', indexVieset, name='index'),
    path('compras/', comprasViewset, name='compras'),
    path('contacto/', contactoViewset, name='contacto'),
]