import random
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

from api import serializer as serializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from userauths.models import User


class DefaultTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializer.DefaultTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = serializer.RegisterSerializer


def generate_otp(length=7):
    otp = ''.join([str(random.randint(0, 9)) for _ in range(length)])
    return otp


class PasswordResetView(generics.RetrieveAPIView):
    """Send OTP, Refresh Token and UUID to user"""
    permission_classes = [AllowAny]
    serializer_class = serializer.UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.filter(email=email).first()
        if user:
            user.otp = generate_otp()  # Unique otp
            user.save()  # Save otp for user
            uuidb64 = user.pk
            # Get the token
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            user.token = token
            # Link to send to user's email, pass to frontend
            link = (f"http://localhost:5173/new_password/"
                    f"?otp={user.otp}&uuid64={uuidb64}"
                    f"&=token{token}")
            email_data = {
                "link": link,
                "username": user.username,
            }
            email_subject = "[Book Club] Reset Password Request"
            email_body = render_to_string("email/reset_password.txt",
                                          email_data)
            email_body = render_to_string("email/reset_password.html",
                                          email_data)
            message = EmailMultiAlternatives(
                subject=email_subject,
                from_email=settings.FROM_EMAIL,  # grab from settings
                to=[user.email],
                body=email_body
            )
            message.attach_alternative(email_body, "text/html")
            message.send()  # send email
            print("Link in PasswordResetView ", link)

        return user


class PasswordChangeView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = serializer.UserSerializer

    def create(self, request, *args, **kwargs):
        otp = request.data['otp']
        uuidb64 = request.data['uuidb64']
        pw = request.data['password']
        user = User.objects.get(id=uuidb64, otp=otp)
        if user:  # if user exists
            user.set_password(pw)
            user.otp = ''  # reset otp to blank
            user.save()
            return Response({"message": "Password successfully reset."},
                            status=status.HTTP_201_CREATED)
        else:  # if user does not exist A
            return Response({"message": "Sorry, user does not exist."},
                            status=status.HTTP_404_NOT_FOUND)
