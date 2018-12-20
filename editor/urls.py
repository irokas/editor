from django.urls import path, include
from django.conf.urls import url
from . import views
from django.views.generic.base import TemplateView

urlpatterns = [
    #url(r'^signup/$', views.signup, name='signup'),
    url('', TemplateView.as_view(template_name='editor/home.html'), name='home'),
]
