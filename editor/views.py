from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.views import generic
from django.utils import timezone
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.views.generic.detail import SingleObjectMixin
from django.views.generic import UpdateView
from django.utils.decorators import method_decorator
import os
import os.path
from django.http import HttpResponse,Http404
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import shutil


#from .models import Profile
"""
class IndexView(generic.ListView):
    template_name = 'editor/home.html'
    def get_queryset(self):
        return
"""
def register(request):
    form=UserCreationForm()
    print("fjvbefhvbefh");
    return render(request, 'templates/registration/signup.html', {'form': form})


def search_dir(request):
    directory = os.path.expanduser("~/Desktop/arxeia/" + request.user.get_username())
    if not os.path.exists(directory):
        os.makedirs(directory)
    context = {}
    return render(request, "editor/home.html", context)

@csrf_exempt
def create_filesystem(request):
    return JsonResponse(create_json(os.path.expanduser("~/Desktop/arxeia/" + request.user.get_username())), safe=False)


def create_json(pth):
    filesystem = []
    for file in os.listdir(pth):
        file_dict = {"name":file, "absolute_path": pth + '/' + file, "type":"file", "children":None}
        if os.path.isdir(file_dict["absolute_path"]):
            file_dict["type"] = "directory"
            file_dict["children"] = create_json(file_dict["absolute_path"])
        filesystem.append(file_dict)
    return filesystem

@csrf_exempt
def open_file(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    path = body['path']
    f = open(path, 'r+')
    contents = f.read()
    f.close()
    return JsonResponse(contents, safe=False)

@csrf_exempt
def save_file(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    path = body['path']
    contents = body['contents']
    os.remove(path);
    f = open(path, 'w')
    f.write(contents)
    f.close()
    return JsonResponse(contents, safe=False)

@csrf_exempt
def create_file(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    path = body['path']
    if os.path.exists(path):
        return JsonResponse("exists", safe=False)
    f = open(path, 'w')
    f.close()
    return JsonResponse(path, safe=False)

@csrf_exempt
def delete_entry(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    path = body['path']
    type = body['type']
    if type == "directory":
        shutil.rmtree(path)
    else :
        os.remove(path);
    return JsonResponse(path, safe=False)

@csrf_exempt
def create_directory(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    path = body['path']
    if os.path.exists(path):
        return JsonResponse("exists", safe=False)
    os.makedirs(path, 0o777)
    return JsonResponse(path, safe=False)
