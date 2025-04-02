from django.contrib import admin
from userauths.models import User, Profile
# Register your models here.


class ProfileAdmin(admin.ModelAdmin):
    """Add on to string representation of profile"""
    list_display = ["user", "full_name"]


admin.site.register(User)
admin.site.register(Profile, ProfileAdmin)
