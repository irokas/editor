"""myapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from editor import views as editor_views


urlpatterns = [
    path('editor/', include('editor.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', editor_views.search_dir, name='home'),
    path('open_filesystem', editor_views.create_filesystem, name='filesystem'),
    path('open_file', editor_views.open_file, name='open_file'),
    path('save_file', editor_views.save_file, name='save_file'),
    path('create_file', editor_views.create_file, name='create_file'),
    path('delete_entry', editor_views.delete_entry, name='delete_entry'),
    path('create_directory', editor_views.create_directory, name='create_directory'),
]
