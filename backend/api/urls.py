from api import views as api_views
from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="BookClub Backend APIs",
      default_version='v1',
      description="Documentation for BookClub APIs",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="jiathehuman@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0),
         name='schema-json'),
    path('', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
    path("user/token/", api_views.DefaultTokenObtainPairView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),
    path("user/register/", api_views.RegisterView.as_view()),
    path("user/reset-password/<email>/",
         api_views.PasswordResetView.as_view()),
    path("user/change-password/", api_views.PasswordChangeView.as_view())
]
