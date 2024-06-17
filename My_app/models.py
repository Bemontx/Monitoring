from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Carros(models.Model):
    marca = models.CharField(max_length=150)
    sucursal = models.IntegerField()
    modelo = models.CharField(max_length=150)

    def __str__(self):
        texto = '{0} {1} {2}'
        return texto.format(self.marca,self.sucursal,self.modelo)
    
    class Meta:
        db_table = 'Cars_Models'

class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    comments = models.CharField(max_length=250)
    
    def __str__(self):
        return f'{self.user} {self.email} {self.comments}'

    class Meta:
        db_table = 'Comments_Users'