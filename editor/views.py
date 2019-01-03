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
from django.http import HttpResponse,Http404
import json
from django.http import JsonResponse


#from .models import Profile
"""

class IndexView(generic.ListView):
    template_name = 'editor/index.html'
    def get_queryset(self):
        return
"""

def register(request):
    form=UserCreationForm()
    return render(request, 'templates/registration/signup.html', {'form': form})


def search_dir(request):
    d = []
    pth = "~/Desktop/arxeia/" + request.user.get_username()
    for file in os.listdir(os.path.expanduser(pth)):
        d.append(file)
    context = {"d": d}
    return render(request, "editor/home.html", context)

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


def open_file(request, path):
    f = open(os.path.expanduser(path), 'r+')
    contents = f.read()
    f.close()
    context = {"contents": contents}
    return render(request, "editor/home.html", context)

"""
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})
"""

"""
class ProfileObjectMixin(SingleObjectMixin):

    model = Profile

    def get_object(self):
        try:
            return self.request.user.get_profile()
        except Profile.DoesNotExist:
            raise NotImplemented(

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        klass = ProfileObjectMixin
        return super(klass, self).dispatch(request, *args, **kwargs)
"""
"""
class ProfileUpdateView(ProfileObjectMixin, UpdateView):

    pass  # That's All Folks!
    """
