# Generated by Django 5.1.7 on 2025-03-30 11:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userauths", "0003_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="otp",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
