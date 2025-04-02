from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
# Create your models here.


class User(AbstractUser):
    """User model stores credentials for the user"""
    username = models.CharField(unique=True, max_length=50, error_messages={
        "unique": "There is already an account registered "
        "with this email."
    })
    email = models.EmailField(unique=True, error_messages={
        "unique": "There is already an account registered "
        "with this email.",
        "blank": "Please enter a valid email"
    })
    full_name = models.CharField(max_length=100)
    otp = models.CharField(max_length=50, null=True, blank=True)
    token = models.CharField(max_length=5000, null=True, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        """Return string representation"""
        return self.full_name

    def save(self, *args, **kwargs):
        """Save full name and username from the email prefix"""
        # Get the first part of the email before '@'
        email_username, full_name = self.email.split("@")
        if self.full_name == "" or self.full_name is None:
            self.full_name = email_username
        if self.username == "" or self.username is None:
            self.username = email_username
        super(User, self).save(*args, **kwargs)


class Profile(models.Model):
    """Profile model stores information about the user"""
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
        """Return string representation"""
        if self.full_name:
            return str(self.full_name)
        else:
            # Use the name in the related User model
            return str(self.user.full_name)


def profile_creation(sender, instance, created, **kwargs):
    """Helper Function to create a Profile with an associated User instance"""
    if created:
        Profile.objects.create(user=instance)


def profile_save(sender, instance, **kwargs):
    """Helper Function to save a Profile that is created"""
    # Since profile_creation() creates an associated profile, just call save()
    instance.profile.save()


# Connect to signals
post_save.connect(profile_creation, sender=User)
post_save.connect(profile_save, sender=User)
