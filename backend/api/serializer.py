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
    repeat_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'repeat_password']

    def validate(self, data):
        errors = {}
        print("Start of validation", errors)

        #  Check if email is already taken
        if User.objects.filter(email=data["email"]).exists():
            errors["email"] = "This email is already registered."

        #  Check if passwords match
        if data["password"] != data["repeat_password"]:
            errors["repeat_password"] = "Passwords must match."

        print("In register serializer", errors)

        #  Validate password strength
        try:
            validate_password(data["password"])

        except serializers.ValidationError as e:
            errors["password"] = list(e.messages)

        #  If there are any errors, raise a single ValidationError
        if errors:
            print("In Register Serializer", errors)
            raise serializers.ValidationError(errors)

        return data

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
