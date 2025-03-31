from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
# Create your models here.


class User(AbstractUser):
    """Store credentials for the user"""
    username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    otp = models.CharField(max_length=50, null=True, blank=True)
    token = models.CharField(max_length=5000, null=True, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        # Get the first part of the email before '@'
        email_username, full_name = self.email.split("@")
        if self.full_name == "" or self.full_name is None:
            self.full_name = email_username
        if self.username == "" or self.username is None:
            self.username = email_username
        super(User, self).save(*args, **kwargs)


class Profile(models.Model):
    """Store information about the user"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # To accomodate different image type,
    # using file field instead of image field
    image = models.FileField(upload_to="user", default="default-profile.jpg",
                             null=True, blank=True)
    full_name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True, null=True)
    about = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            # Use the name in the related User model
            return str(self.user.full_name)


def profile_creation(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def profile_save(sender, instance, **kwargs):
    instance.profile.save()


post_save.connect(profile_creation, sender=User)
post_save.connect(profile_save, sender=User)
