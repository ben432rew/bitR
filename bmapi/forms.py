from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.admin import UserAdmin
from bitweb.models import User
from django import forms
from django.core.exceptions import ValidationError
import re


class UserCreateForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "password1", "password2")

   # this redefines the save function to include the fields you added
    def save(self, commit=True):
        password = self.cleaned_data["password1"]
        check_password_strenght(password)
        user = super(UserCreateForm, self).save(commit=False)
        if commit:
            user.save()
            return user

    def clean_username(self):
        # Since User.username is unique, this check is redundant,
        # but it sets a nicer error message than the ORM. See #13147.
        username = self.cleaned_data["username"]
        try:
            User._default_manager.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError(self.error_messages['duplicate_username'])
# checks the password strength
def check_password_strenght(password):
    if None == re.match("^(?=[^\d_].*?\d)\w(\w|[!@#$%]){1,256}",password):
        raise ValidationError("Password is not strong enough")