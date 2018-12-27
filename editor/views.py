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
#from .models import Profile


class IndexView(generic.ListView):
    template_name = 'editor/index.html'
    def get_queryset(self):
        return
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
    
