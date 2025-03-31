from rest_framework import serializers
from userauths.models import Profile, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user"""
    class Meta:
        model = User
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for profile"""
    class Meta:
        model = Profile
        fields = "__all__"


class DefaultTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Get all the information to add to the token
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True,
                                     validators=[validate_password])
    password_2 = serializers.CharField(write_only=True, required=True,
                                       validators=[validate_password])

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'password_2']

    def validate(self, attributes):
        if attributes['password'] != attributes['password_2']:
            raise serializers.ValidationError({"password":
                                               "Passwords must match"})

        return attributes

    def create(self, validated_data):
        user = User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
        )
        email_username, _ = user.email.split("@")
        user.username = email_username
        user.set_password(validated_data['password'])
        user.save()
        return user
